import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { getCookie } from '../common/types/request-with-cookies';
import { CONFIG } from '../config/config.constants';
import { AuthService } from './auth.service';
import { clearAuthCookies, setAuthCookies } from './cookies';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UserAuthService } from './services/user-auth.service';
import type { GoogleUser } from './strategies/google.strategy';
import { REFRESH_COOKIE } from './strategies/jwt.strategy';
import type { CurrentUserPayload, SessionContext } from './types';

type GoogleCallbackRequest = Request & { user: GoogleUser };

const sessionCtx = (req: Request): SessionContext => ({
  ipAddress: req.ip,
  userAgent: req.get('user-agent') ?? undefined,
});

@Controller('auth')
export class AuthController {
  private readonly nodeEnv: string;
  private readonly webOrigin: string;

  constructor(
    private readonly auth: AuthService,
    private readonly userAuth: UserAuthService,
    config: ConfigService,
  ) {
    this.nodeEnv = config.get<string>(CONFIG.app.nodeEnv) ?? 'development';
    this.webOrigin = config.get<string>(CONFIG.app.webOrigin) ?? '';
  }

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userAuth.registerLocal(dto);
    const tokens = await this.auth.issue(user, sessionCtx(req));
    setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
    return { user: { id: user.userId, email: user.email, role: user.role } };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userAuth.loginLocal(dto.email, dto.password);
    const tokens = await this.auth.issue(user, sessionCtx(req));
    setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
    return { user: { id: user.userId, email: user.email, role: user.role } };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = getCookie(req, REFRESH_COOKIE);
    try {
      const { user, tokens } = await this.auth.refresh(raw, sessionCtx(req));
      setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
      return { user: { id: user.userId, email: user.email, role: user.role } };
    } catch (err) {
      clearAuthCookies(res, { nodeEnv: this.nodeEnv });
      throw err;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: CurrentUserPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(user?.sessionId);
    clearAuthCookies(res, { nodeEnv: this.nodeEnv });
  }

  @Get('me')
  async me(@CurrentUser() user: CurrentUserPayload) {
    const me = await this.userAuth.loadMe(user.userId);
    return { user: me };
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  google() {
    // Passport redirects to Google before reaching this handler.
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: GoogleCallbackRequest,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userAuth.findOrLinkGoogle(req.user);
      const tokens = await this.auth.issue(user, sessionCtx(req));
      setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
      res.redirect(`${this.webOrigin}/auth/callback`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'oauth_failed';
      res.redirect(
        `${this.webOrigin}/auth/callback?error=${encodeURIComponent(message)}`,
      );
    }
  }
}

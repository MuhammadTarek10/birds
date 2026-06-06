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
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ErrorResponse } from '../common/dto/error.response';
import { getCookie } from '../common/types/request-with-cookies';
import { CONFIG } from '../config/config.constants';
import { AuthService } from './auth.service';
import { clearAuthCookies, setAuthCookies } from './cookies';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MeEnvelope } from './dto/responses/me.envelope';
import { UserSummaryEnvelope } from './dto/responses/user-summary.envelope';
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

@ApiTags('Auth')
@ApiCookieAuth('cookie-auth')
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
  @ApiSecurity({})
  @Post('register')
  @ResponseMessage('Registered')
  @ApiOperation({
    summary: 'Register a new local account and issue session cookies',
  })
  @ApiCreatedResponse({ type: UserSummaryEnvelope })
  @ApiConflictResponse({
    type: ErrorResponse,
    description: 'Email already registered',
  })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userAuth.registerLocal(dto);
    const tokens = await this.auth.issue(user, sessionCtx(req));
    setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
    return { id: user.userId, email: user.email, role: user.role };
  }

  @Public()
  @ApiSecurity({})
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logged in')
  @ApiOperation({
    summary: 'Log in with email + password and issue session cookies',
  })
  @ApiOkResponse({ type: UserSummaryEnvelope })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Invalid credentials',
  })
  @ApiTooManyRequestsResponse({
    type: ErrorResponse,
    description: 'Account temporarily locked',
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userAuth.loginLocal(dto.email, dto.password);
    const tokens = await this.auth.issue(user, sessionCtx(req));
    setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
    return { id: user.userId, email: user.email, role: user.role };
  }

  @Public()
  @ApiSecurity({})
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Session refreshed')
  @ApiOperation({ summary: 'Rotate the session using the refresh cookie' })
  @ApiOkResponse({ type: UserSummaryEnvelope })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Missing or invalid refresh token',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = getCookie(req, REFRESH_COOKIE);
    try {
      const { user, tokens } = await this.auth.refresh(raw, sessionCtx(req));
      setAuthCookies(res, tokens, { nodeEnv: this.nodeEnv });
      return { id: user.userId, email: user.email, role: user.role };
    } catch (err) {
      clearAuthCookies(res, { nodeEnv: this.nodeEnv });
      throw err;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke current session and clear cookies' })
  @ApiNoContentResponse({ description: 'Logged out' })
  async logout(
    @CurrentUser() user: CurrentUserPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(user?.sessionId);
    clearAuthCookies(res, { nodeEnv: this.nodeEnv });
  }

  @Get('me')
  @ResponseMessage('User retrieved')
  @ApiOperation({ summary: 'Get the current authenticated user' })
  @ApiOkResponse({ type: MeEnvelope })
  @ApiUnauthorizedResponse({ type: ErrorResponse })
  async me(@CurrentUser() user: CurrentUserPayload) {
    return this.userAuth.loadMe(user.userId);
  }

  @Public()
  @ApiSecurity({})
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Start the Google OAuth flow (redirects to Google)',
  })
  @ApiFoundResponse({ description: 'Redirects to Google consent page' })
  google() {
    // Passport redirects to Google before reaching this handler.
  }

  @Public()
  @ApiSecurity({})
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary:
      'Google OAuth callback — issues cookies and redirects to WEB_ORIGIN/auth/callback',
  })
  @ApiFoundResponse({
    description:
      'Redirects to ${WEB_ORIGIN}/auth/callback (with ?error=… on failure)',
  })
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

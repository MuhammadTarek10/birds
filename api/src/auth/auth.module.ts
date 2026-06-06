import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthCredentialsRepository } from './repositories/auth-credentials.repository';
import { SessionsRepository } from './repositories/sessions.repository';
import { UserAccountsRepository } from './repositories/user-accounts.repository';
import { UserProfilesRepository } from './repositories/user-profiles.repository';
import { UsersRepository } from './repositories/users.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { UserAuthService } from './services/user-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserAuthService,
    TokenService,
    PasswordService,
    UsersRepository,
    UserProfilesRepository,
    AuthCredentialsRepository,
    UserAccountsRepository,
    SessionsRepository,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    GoogleAuthGuard,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}

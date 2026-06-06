import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

export type GoogleUser = {
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('google.clientId') ?? '',
      clientSecret: config.get<string>('google.clientSecret') ?? '',
      callbackURL: config.get<string>('google.redirectUri') ?? '',
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: unknown, user?: GoogleUser) => void,
  ): void {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      done(new Error('Google profile missing email'));
      return;
    }
    const emailVerified = profile.emails?.[0]?.verified === true;
    const user: GoogleUser = {
      providerUserId: profile.id,
      email,
      emailVerified,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      avatarUrl: profile.photos?.[0]?.value,
    };
    done(null, user);
  }
}

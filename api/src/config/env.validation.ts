import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvVars {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(0)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  APP_URL?: string;

  @IsString()
  @IsOptional()
  WEB_ORIGIN?: string;

  @IsString()
  @IsOptional()
  ENABLE_DOCS?: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsInt()
  @Min(1000)
  @IsOptional()
  JWT_ACCESS_TTL_MS?: number;

  @IsInt()
  @Min(1000)
  @IsOptional()
  JWT_REFRESH_TTL_MS?: number;

  @ValidateIf((o: EnvVars) => o.NODE_ENV === NodeEnv.Production)
  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_CLIENT_ID?: string;

  @ValidateIf((o: EnvVars) => o.NODE_ENV === NodeEnv.Production)
  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_CLIENT_SECRET?: string;

  @ValidateIf((o: EnvVars) => o.NODE_ENV === NodeEnv.Production)
  @IsString()
  @IsNotEmpty()
  GOOGLE_OAUTH_REDIRECT_URI?: string;

  @IsString()
  @IsOptional()
  R2_ACCOUNT_ID?: string;

  @IsString()
  @IsOptional()
  R2_ACCESS_KEY_ID?: string;

  @IsString()
  @IsOptional()
  R2_SECRET_ACCESS_KEY?: string;

  @IsString()
  @IsOptional()
  R2_BUCKET?: string;

  @IsString()
  @IsOptional()
  R2_PUBLIC_BASE_URL?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Invalid environment variables:\n${errors.toString()}`);
  }
  return validated;
}

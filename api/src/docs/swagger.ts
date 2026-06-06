import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'api/docs';

export const buildOpenApiDocument = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Memory Vault API')
    .setDescription('Private multi-tenant memory app')
    .setVersion('0.1.0')
    .addCookieAuth(
      'mv_access',
      { type: 'apiKey', in: 'cookie', name: 'mv_access' },
      'cookie-auth',
    )
    .build();

  return SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });
};

export const mountSwagger = (app: INestApplication) => {
  const document = buildOpenApiDocument(app);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: { withCredentials: true },
  });
};

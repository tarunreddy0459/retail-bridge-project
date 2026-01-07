import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Retail Bridge API')
    .setDescription('API for Retail Bridge Application built with NestJS')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Enter a JWT token to authorize the requests...',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWTBearerAuth',
    )
    .addSecurityRequirements('JWTBearerAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const APP_PORT = configService.get<number>('PORT') || 3000;
  await app.listen(APP_PORT);
  const logger = new Logger('Main Module');
  logger.verbose('-------------------------------------');
  logger.log(
    'Swagger 🛠️  http://localhost:' +
      (process.env.PORT || 3003) +
      '/swagger 🛠️',
  );
  logger.verbose('-------------------------------------');
}
bootstrap();

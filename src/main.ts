import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './config/config';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './common/logger/winston-logger';
import { RolesGuard } from './common/guard/roles.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerConfig),
  });


  // Validate to request data
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

  // Check role Wise permission
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HMS')
    .setDescription('Hospital Management Rest API')
    .setVersion('0.0.1')
    .addTag('HMS')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(config.port || 3000);
}

bootstrap();

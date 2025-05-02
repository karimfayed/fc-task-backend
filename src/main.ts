import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpErrorFilter } from './common/filters.ts/http-exception.filter';
import { CustomLogger } from './common/logger/custom-logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save the OpenAPI document as YAML
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./openapi.yaml', yamlDocument);

  // Optionally, set up Swagger UI
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalFilters(app.get(HttpErrorFilter));
  const logger = app.get(CustomLogger);
  try {
    await app.listen(3000);
    logger.log(`🚀 App running on ${await app.getUrl()}`);
  } catch (error) {
    logger.error('NestJS failed to start', error.stack);
  }
}
bootstrap();

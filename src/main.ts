import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpErrorFilter } from './common/filters.ts/http-exception.filter';
import { CustomLogger } from './common/logger/custom-logger.service';
// import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalFilters(app.get(HttpErrorFilter));
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
  const logger = app.get(CustomLogger);
  try {
    await app.listen(3000);
    logger.log(`🚀 App running on ${await app.getUrl()}`);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error('NestJS failed to start', error.stack);
  }
}
bootstrap();

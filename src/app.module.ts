import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomLogger } from './common/logger/custom-logger.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpErrorFilter } from './common/filters.ts/http-exception.filter';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './common/constants/app.constant';
import { ProviderModule } from './provider/provider.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET_KEY),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    ProviderModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [CustomLogger, ResponseInterceptor, HttpErrorFilter, AppService],
})
export class AppModule {}

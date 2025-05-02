import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpResponse } from '../interfaces/http-response.interface.ts.js';
import { STATUS_CODES } from 'http';
import { CustomLogger } from '../logger/custom-logger.service.js';
import { logRequestDto } from '../dtos/logger.dto.js';
import { LoggerContext } from '../enums/logger-context.enum.js';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.originalUrl;
    const start = Date.now();
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const statusMessage =
          STATUS_CODES[statusCode] || 'No Message Available';

        const duration = Date.now() - start;

        const logData: logRequestDto = {
          context: LoggerContext.INTERCEPTOR,
          method,
          url,
          statusCode,
          duration,
        };

        this.logger.logRequest(logData);

        const httpResponse: HttpResponse<T> = {
          statusCode: statusCode,
          body: {
            message: statusMessage,
            result: data,
          },
        };
        return httpResponse;
      }),
    );
  }
}

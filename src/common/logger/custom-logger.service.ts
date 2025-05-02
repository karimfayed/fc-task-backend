// common/logger/custom-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { logErrorDto, logRequestDto } from '../dtos/logger.dto';

@Injectable()
export class CustomLogger extends Logger {
  logRequest(data: logRequestDto) {
    const { context, duration, method, statusCode, url } = data;
    this.log(`[${context}] ${method} ${url} → ${statusCode} in ${duration}ms`);
  }

  logError(data: logErrorDto) {
    const { context, error, method, statusCode, url } = data;
    this.error(`[${context}] ${method} ${url} → ${statusCode} - ${error}`);
  }
}

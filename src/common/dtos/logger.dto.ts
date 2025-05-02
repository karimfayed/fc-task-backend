export interface CustomLoggerDto {
  context: string;
  method: string;
  url: string;
  statusCode: number;
}

export interface logRequestDto extends CustomLoggerDto {
  duration: number;
}

export interface logErrorDto extends CustomLoggerDto {
  error: string;
}

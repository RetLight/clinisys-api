import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const errorResponse = {
      success: false,
      message: exception.message,
      timestamp: new Date().toISOString(),
      statusCode: status,
    };

    response.status(status).json(errorResponse);
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Exception';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'object' && responseBody !== null) {
        const { message: responseMessage, error: responseError } =
          responseBody as { message?: string | string[]; error?: string };

        message = Array.isArray(responseMessage)
          ? responseMessage.join(', ')
          : responseMessage || message;
        error = responseError || error;
      } else {
        message = responseBody as string;
        error = exception.name || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      error = exception.name || error;
    }

    console.log('Exception', exception);
    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

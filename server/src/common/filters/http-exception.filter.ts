import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          errors = this.formatValidationErrors(responseObj.message);
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (errors) {
      errorResponse.errors = errors;
    }

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(messages: string[]): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    messages.forEach((msg) => {
      // Try to extract field name from message
      const match = msg.match(/^(\w+)\s/);
      const field = match ? match[1] : 'general';

      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(msg);
    });

    return errors;
  }
}


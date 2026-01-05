import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If response already has success property, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Handle paginated responses
        if (data && typeof data === 'object' && 'data' in data && 'total' in data) {
          return {
            success: true,
            data: data.data,
            meta: {
              total: data.total,
              page: data.page,
              limit: data.limit,
              totalPages: data.totalPages,
            },
            message: data.message,
          };
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}


import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type {
  ApiSuccessResponse,
  PaginatedResponse,
} from '@monorepo-shop/shared';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T> | PaginatedResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T> | PaginatedResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has the correct format (e.g., error responses), return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Check if it's paginated response
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return {
            success: true,
            data: data.data,
            meta: data.meta,
          } as PaginatedResponse<T>;
        }

        // Standard success response
        return {
          success: true,
          data,
        } as ApiSuccessResponse<T>;
      }),
    );
  }
}

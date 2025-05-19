/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const httpRequest = ctx.switchToHttp();
    const response: Response = httpRequest.getRequest();
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: response?.statusCode ?? HttpStatus.OK,
          data: data?.data ?? data,

          message: data?.message ?? 'SUCCESS',
          success: true,
        };
      }),
    );
  }
}

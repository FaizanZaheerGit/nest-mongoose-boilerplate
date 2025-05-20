/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const httpRequest = ctx.switchToHttp();
    const message = this.reflector.get('response_message', ctx.getHandler());
    const response: Response = httpRequest.getRequest();
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: response?.statusCode ?? HttpStatus.OK,
          data,
          message: message ?? 'SUCCESS',
          success: true,
        };
      }),
    );
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  // NOTE: Below line has been added to remove unsued variables typescript error
  console.log('Data Inside Current User Decorator:  =>  ' + JSON.stringify(data));
  const request: Request = ctx.switchToHttp().getRequest();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return request?.user;
});

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserRequestData {
  id: string;
  email: string;
  status: string;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

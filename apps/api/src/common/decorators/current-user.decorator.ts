import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUserDto } from '@monorepo-shop/shared';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUserDto | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUserDto }>();
    return request.user;
  },
);

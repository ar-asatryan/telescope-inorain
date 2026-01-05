import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';

/**
 * Decorator to extract current user from request
 * Can optionally extract a specific property from the user
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);


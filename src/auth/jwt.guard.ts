import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAuthorized = super.canActivate(context);

    if (typeof isAuthorized === 'boolean') {
      if (!isAuthorized) {
        throw new UnauthorizedException(
          'Unauthorized access. Invalid or missing token.',
        );
      }
      return isAuthorized;
    }

    return isAuthorized;
  }
}

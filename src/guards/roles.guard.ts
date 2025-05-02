import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.role;
    console.log('GGG', request.role);
    console.log('GGG', !userRole);
    console.log('GGG', !requiredRoles.includes(userRole));
    console.log('GGG', requiredRoles);

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Access denied for your role');
    }

    return true;
  }
}

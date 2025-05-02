import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { RequestDto } from 'src/auth/dtos/request.dto';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestDto = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    console.log('SSSS');

    try {
      const payload = this.jwtService.verify(token);
      console.log('SSSS', payload);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.userId = payload.userId;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.role = payload.role;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    return request.headers.authorization?.split(' ')[1];
  }
}

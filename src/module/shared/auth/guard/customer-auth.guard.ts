import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WebTokenService } from '../../web-token/service/web-token.service';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  constructor(private readonly webTokenService: WebTokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization }: any = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new ForbiddenException('Sessão expirada! Faça login novamente.');
    }

    const token = authorization.replace(/bearer/gim, '').trim();

    if (!token) {
      throw new ForbiddenException('Sessão expirada! Faça login novamente.');
    }

    const resp = await this.webTokenService.verify(token);

    if (!resp) {
      throw new UnauthorizedException(
        'Erro na autenticação. Faça login novamente.',
      );
    }

    return true;
  }
}

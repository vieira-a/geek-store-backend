import { Injectable } from '@nestjs/common';
import { WebTokenInterface } from '../interface/web-token.inteface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WebTokenService implements WebTokenInterface {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async sign(payload: string | object | Buffer): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (typeof payload === 'string') {
      return this.jwtService.sign(payload, { secret: secret });
    } else {
      return this.jwtService.sign(payload as object | Buffer, {
        secret: secret,
      });
    }
  }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebTokenService } from './service/web-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    WebTokenService,
    {
      provide: 'WebTokenInterface',
      useClass: WebTokenService,
    },
  ],
  exports: [WebTokenService, 'WebTokenInterface'],
})
export class WebTokenModule {}

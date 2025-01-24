import { Module } from '@nestjs/common';
import { CryptographyService } from './service/criptography.service';

@Module({
  providers: [
    CryptographyService,
    {
      provide: 'CryptographyInterface',
      useClass: CryptographyService,
    },
  ],
  exports: ['CryptographyInterface'],
})
export class CriptographyModule {}

import { Module } from '@nestjs/common';
import { SasService } from './sas.service';

@Module({
  providers: [SasService]
})
export class SasModule {}

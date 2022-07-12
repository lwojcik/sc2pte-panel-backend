import { Module } from '@nestjs/common';
import { UserConfigController } from './userconfig.controller';
import { UserConfigService } from './userconfig.service';

@Module({
  controllers: [UserConfigController],
  providers: [UserConfigService],
})
export class ConfiguratorModule {}

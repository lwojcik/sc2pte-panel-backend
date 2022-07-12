import { Module } from '@nestjs/common';
import { ConfiguratorController } from './configurator.controller';
import { ConfiguratorService } from './configurator.service';

@Module({
  controllers: [ConfiguratorController],
  providers: [ConfiguratorService],
})
export class ConfiguratorModule {}

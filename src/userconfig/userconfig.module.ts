import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChannelConfig,
  ChannelConfigSchema,
} from './schemas/channel-config.schema';
import { UserConfigController } from './userconfig.controller';
import { UserConfigService } from './userconfig.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChannelConfig.name,
        schema: ChannelConfigSchema,
      },
    ]),
  ],
  controllers: [UserConfigController],
  providers: [UserConfigService],
})
export class ConfiguratorModule {}

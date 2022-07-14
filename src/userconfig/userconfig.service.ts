import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaveChannelConfigDto } from './dto/save-channel-config.dto';
import {
  ChannelConfig,
  ChannelConfigDocument,
} from './schemas/channel-config.schema';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectModel(ChannelConfig.name)
    private channelConfigModel: Model<ChannelConfigDocument>
  ) {}

  async get(channelId: string) {
    const channelConfig = this.channelConfigModel.findOne({ channelId }).exec();

    if (!channelConfig) {
      throw new NotFoundException(`Channel config #${channelId} not found`);
    }

    return channelConfig;
  }

  async save(
    saveChannelConfigDto: SaveChannelConfigDto
  ): Promise<ChannelConfig> {
    const newChannelConfig = new this.channelConfigModel(saveChannelConfigDto);
    return newChannelConfig.save();
  }
}

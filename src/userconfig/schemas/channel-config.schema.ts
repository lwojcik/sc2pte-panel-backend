import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlayerProfileSchema } from './player-profile.schema';

const maxProfiles = 3;
const arrayLimit = (val: unknown[]) => val.length <= maxProfiles;

@Schema({
  timestamps: true,
})
export class ChannelConfig {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  channelId: string;

  @Prop({
    type: [
      {
        type: PlayerProfileSchema,
        ref: 'playerProfileModel',
      },
    ],
    validate: [arrayLimit, `{PATH} exceeds the limit of ${maxProfiles}`],
  })
  profiles: object[];
}

export type ChannelConfigDocument = ChannelConfig & Document;

export const ConfigSchema = SchemaFactory.createForClass(ChannelConfig);

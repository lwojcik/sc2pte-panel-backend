// tslint:disable: variable-name
import { Document } from 'mongoose';
import { createSchema, Type, typedModel } from 'ts-mongoose';
import StarCraft2API from 'starcraft2-api';

const regionIds = StarCraft2API.getAllRegionIds().map(regionId => regionId.toString());
const realmIds = StarCraft2API.getAllAvailableSc2Realms().map(realmId => realmId.toString());

interface PlayerProfile {
  regionId: string;
  realmId: string;
  profileId: string;
}

interface ChannelConfig extends Document {
  channelId: string;
  profiles: PlayerProfile[];
  createdAt: Date;
  updatedAt: Date;
}

const PlayerProfileSchema = createSchema({
  regionId: {
    type: Type.string({ required: true }),
    enum: regionIds,
  },
  realmId: {
    type: Type.string({ required: true }),
    enum: realmIds,
  },
  profileId: {
    type: Type.string({ required: true }),
  },
}, {
  _id: false,
  timestamps: false,
});

const ChannelConfigSchema = createSchema({
  channelId: {
    type: Type.string({
      required: true,
      unique: true,
      index: true,
    }),
  },
  profiles: {
    type: Type.array({ required: true }).of(PlayerProfileSchema),
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: {
    createdAt: true,
  },
});

ChannelConfigSchema.pre<ChannelConfig>('save', function(next): void {
  this.updatedAt = new Date();
  next();
});

export default typedModel('ChannelConfig', ChannelConfigSchema);
// tslint:enable: variable-name
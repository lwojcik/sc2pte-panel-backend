// tslint:disable: variable-name
import { Document } from 'mongoose';
import { createSchema, Type, typedModel } from 'ts-mongoose';
import StarCraft2API from 'starcraft2-api';

const regionIds = StarCraft2API.getAllRegionIds().map(regionId => regionId.toString());
const realmIds = StarCraft2API.getAllAvailableSc2Realms().map(realmId => realmId.toString());

const maxProfiles = process.env.SC2PTE_MAXIMUM_PROFILE_COUNT || '3';

interface PlayerProfile {
  regionId: string;
  realmId: string;
  profileId: string;
  locale: string;
}

interface ChannelConfig extends Document {
  channelId: string;
  profiles: PlayerProfile[];
  createdAt: Date;
  updatedAt: Date;
  maxProfiles: string;
}

// const arrayLimit = (val: unknown[]) => val.length <= maxPlayerProfileCount;

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
  locale: {
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
    type: Type.array({
      required: true,
      // validate: [arrayLimit, `profile array exceeds the limit of ${maxPlayerProfileCount}`],
    }).of(PlayerProfileSchema),
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
  maxProfiles: {
    type: Type.string({
      default: maxProfiles,
    }),
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
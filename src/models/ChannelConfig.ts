import { Document as MongooseDocument } from 'mongoose';
import { createSchema, Type, typedModel } from 'ts-mongoose';
import { StarCraft2API } from 'starcraft2-api';

const regionIds = StarCraft2API.getAllRegionIds().map((regionId) => regionId.toString());
const realmIds = StarCraft2API.getAllAvailableSc2Realms().map((realmId) => realmId.toString());

const maxProfiles = Number(process.env.SC2PTE_MAXIMUM_PROFILE_COUNT) || 3;

interface PlayerProfile {
  regionId: string;
  realmId: string;
  profileId: string;
  locale: string;
}

interface ChannelConfig extends MongooseDocument {
  channelId: string;
  profiles: PlayerProfile[];
  createdAt: Date;
  updatedAt: Date;
  maxProfiles: string;
}

const arrayLimit = (val: unknown[]) => val.length <= maxProfiles;

const PlayerProfileSchema = createSchema(
  {
    regionId: Type.string({
      required: true,
      enum: regionIds,
    }),
    realmId: Type.string({
      required: true,
      enum: realmIds,
    }),
    profileId: Type.string({ required: true }),
    locale: Type.string({ required: true }),
  },
  {
    id: false,
    timestamps: false,
  },
);

const ChannelConfigSchema = createSchema(
  {
    channelId: Type.string({
      required: true,
      unique: true,
      index: true,
    }),
    profiles: Type.array({
      required: true,
      validate: [
        arrayLimit,
        `profile array exceeds the limit of ${maxProfiles}`,
      ],
    }).of(PlayerProfileSchema),
    createdAt: Type.date({
      default: Date.now,
    }),
    updatedAt: Type.date({
      default: Date.now,
    }),
  },
  {
    timestamps: {
      createdAt: true,
    },
  },
);

// eslint-disable-next-line func-names
ChannelConfigSchema.pre<ChannelConfig>('save', function (next): void {
  this.updatedAt = new Date();
  next();
});

export default typedModel('ChannelConfig', ChannelConfigSchema);
// tslint:enable: variable-name

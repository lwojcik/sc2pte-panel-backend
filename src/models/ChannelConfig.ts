import { Document as MongooseDocument, Schema, model } from "mongoose";
// import { createSchema, Type, typedModel } from 'ts-mongoose';
import { StarCraft2API } from "starcraft2-api";

const regionIds = StarCraft2API.getAllRegionIds().map((regionId) =>
  regionId.toString()
);
const realmIds = StarCraft2API.getAllAvailableSc2Realms().map((realmId) =>
  realmId.toString()
);

const maxProfiles = 3;

interface PlayerProfile extends MongooseDocument {
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

const PlayerProfileSchema = new Schema<PlayerProfile>(
  {
    regionId: {
      type: String,
      required: true,
      enum: regionIds,
    },
    realmId: {
      type: String,
      required: true,
      enum: realmIds,
    },
    profileId: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
  },
  {
    id: false,
    timestamps: false,
  }
);

const ChannelConfigSchema = new Schema<ChannelConfig>(
  {
    channelId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    profiles: {
      type: [
        {
          type: PlayerProfileSchema,
          ref: "playerProfileModel",
        },
      ],
      validate: [arrayLimit, `{PATH} exceeds the limit of ${maxProfiles}`],
    },
  },
  {
    timestamps: true,
  }
);

export default model("ChannelConfig", ChannelConfigSchema);
// tslint:enable: variable-name

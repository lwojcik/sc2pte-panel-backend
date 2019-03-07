import { Document, Schema, Model, model } from "mongoose";

export interface ChannelConfigDocument extends Document {
  year: number;
  name: string;
  createdDate: Date;
}

export interface ChannelConfigModel extends ChannelConfigDocument {}

export const ChannelConfigSchema: Schema = new Schema(
  {
    channelId: {
      type: Number,
      required: [true, 'channelId required'],
      unique: true,
    },
    regionId: {
      type: Number,
      enum: [1, 2, 3, 5],
      required: [true, 'regionId required'],
    },
    realmId: {
      type: Number,
      enum: [1, 2],
      required: [true, 'realmId required'],
    },
    playerId: {
      type: Number,
      required: [true, 'playerId required'],
    },
    selectedView: {
      type: String,
      enum: ['summary', 'detailed'],
      required: [true, 'selectedView required'],
    }
  },
  { collection: "channelConfigs" }
);

ChannelConfigSchema.pre<ChannelConfigDocument>("save", async function() {
  this.createdDate = new Date();
});

export const ChannelConfig: Model<ChannelConfigModel> = model<ChannelConfigModel>(
  "ChannelConfig",
  ChannelConfigSchema
);

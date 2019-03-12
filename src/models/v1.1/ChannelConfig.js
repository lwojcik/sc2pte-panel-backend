const { Schema, model } = require('mongoose');

const ChannelConfigSchema = new Schema(
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
    },
  },
  { collection: 'channelConfigs' },
);

ChannelConfigSchema.pre('save', async () => {
  this.createdDate = new Date();
});

const ChannelConfig = model(
  'ChannelConfig',
  ChannelConfigSchema,
);

module.exports = ChannelConfig;

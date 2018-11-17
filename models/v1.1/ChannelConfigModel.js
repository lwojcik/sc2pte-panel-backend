const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChannelConfigSchema = new Schema({
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
});

module.exports = mongoose.model('ChannelConfig', ChannelConfigSchema);

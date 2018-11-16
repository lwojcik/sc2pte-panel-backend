const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChannelConfigSchema = new Schema({
  channelId: {
    type: Number,
    required: [true, 'channelId required'],
    unique: true,
  },
  server: {
    type: String,
    enum: ['eu', 'us', 'kr'],
    required: [true, 'server required'],
  },
  playerid: {
    type: Number,
    required: [true, 'playerid required'],
  },
  region: {
    type: Number,
    min: 0,
    max: 9,
    required: [true, 'region required'],
  },
  name: {
    type: String,
    min: 1,
    max: 12,
    required: [true, 'name required'],
  },
});

module.exports = mongoose.model('ChannelConfig', ChannelConfigSchema);

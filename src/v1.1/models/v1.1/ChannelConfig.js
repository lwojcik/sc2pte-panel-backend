const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ChannelConfigSchema = new Schema({
  channelId: {
    type: Number,
    required: [true, 'channelId required'],
    unique: true,
    index: true,
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
    trim: true,
    enum: ['summary', 'detailed'],
    required: [true, 'selectedView required'],
  },
  language: {
    type: String,
    trim: true,
    enum: ['en', 'es', 'pl', 'ru', 'kr', 'fr', 'it'],
    required: [true, 'language required'],
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
},
{
  timestamps: true,
});

ChannelConfigSchema.pre('save', (next) => {
  const now = new Date();
  this.updatedAt = now;
  if (!this.created_at) {
    this.createdAt = now;
  }
  next();
});

module.exports = model('ChannelConfig', ChannelConfigSchema);

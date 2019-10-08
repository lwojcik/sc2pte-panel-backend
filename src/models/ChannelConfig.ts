// import { createSchema, Type, typedModel } from 'ts-mongoose';
// TODO: migrate fully to ts-mongoose

import mongoose, { SchemaDefinition } from 'mongoose';

const { Schema, model } = mongoose;

interface ChannelConfig {
  channelId: object;
  regionId: number;
  realmId: number;
  profileId: number;
}

const channelConfigSchema = new Schema({
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
}) as SchemaDefinition<ChannelConfig>;

channelConfigSchema.pre('save', (next) => {
  const now = new Date();
  this.updatedAt = now;
  if (!this.created_at) {
    this.createdAt = now;
  }
  next();
});

export default model('ChannelConfig', ChannelConfigSchema);
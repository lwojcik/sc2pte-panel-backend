import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StarCraft2API } from 'starcraft2-api';

const regionIds = StarCraft2API.getAllRegionIds().map((regionId) =>
  regionId.toString()
);
const realmIds = StarCraft2API.getAllAvailableSc2Realms().map((realmId) =>
  realmId.toString()
);

@Schema({
  id: false,
  timestamps: false,
})
export class PlayerProfile {
  @Prop({
    type: String,
    required: true,
    enum: regionIds,
  })
  regionId: string;

  @Prop({
    type: String,
    required: true,
    enum: realmIds,
  })
  realmId: string;

  @Prop({
    type: String,
    required: true,
  })
  locale: string;
}

export type PlayerProfileDocument = PlayerProfile & Document;

export const PlayerProfileSchema = SchemaFactory.createForClass(PlayerProfile);

// tslint:disable: variable-name
// import { createSchema, Type, typedModel } from 'ts-mongoose';
// TODO: migrate fully to ts-mongoose
import { createSchema, Type, typedModel } from 'ts-mongoose';

// interface ChannelConfig {
//   channelId: object;
//   regionId: number;
//   realmId: number;
//   profileId: number;
// }

const PlayerProfileSchema = createSchema({
  regionId: {
    type: Type.string(),
    required: true,
  },
  realmId: {
    type: Type.string(),
    required: true,
  },
  profileId: {
    type: Type.string(),
    required: true,
  },
}, {
  _id: false,
  timestamps: false,
});

const ChannelConfigSchema = createSchema({
  channelId: {
    type: Type.string(),
    required: [true, 'channelId required'],
    unique: true,
    index: true,
  },
  profiles: {
    type: Type.array().of(PlayerProfileSchema),
  },
  updatedAt: {
    type: Date,
  },
},
{
  timestamps: {
    createdAt: true,
  },
});

// channelConfigSchema.pre('save', function(next: any): any {
//   const now = new Date();
//   (this as any).updatedAt = now;
//   if (!this.created_at) {
//     this.createdAt = now;
//   }
//   next();
// };

const ChannelConfig = typedModel('ChannelConfig', ChannelConfigSchema);

export default ChannelConfig;
// tslint:enable: variable-name
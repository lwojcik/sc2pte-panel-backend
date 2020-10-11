import { FastifyPluginCallback } from 'fastify';
import mongoose from 'mongoose';
import fp from 'fastify-plugin';
import { ConfigObject } from '../@types/fastify.d';
import ChannelConfig from '../models/ChannelConfig';

interface DbPluginOptions {
  uri: string;
  maxProfiles: number;
}

const dbPlugin: FastifyPluginCallback<DbPluginOptions> = async (
  server,
  opts: DbPluginOptions,
  next,
) => {
  const { uri, maxProfiles } = opts;

  mongoose.connection.on('error', (err) => {
    server.log.error(`MongoDB error: ${err}`);
  });

  mongoose.connection.once('open', () => {
    server.log.info('MongoDB open');
  });

  mongoose.connection.on('connected', () => {
    server.log.info('MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    server.log.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    server.log.info('MongoDB reconnected');
  });

  await mongoose.connect(
    uri,
    {
      family: 4,
      useNewUrlParser: true,
      keepAlive: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  );

  const save = async ({ channelId, data }: ConfigObject) => {
    try {
      await ChannelConfig.findOneAndUpdate(
        { channelId },
        {
          profiles: data.slice(0, maxProfiles) as any,
        },
        {
          upsert: true,
          runValidators: true,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const get = async (channelId: string) => {
    try {
      const data = await ChannelConfig.findOne({ channelId });
      if (data) {
        return {
          status: 200,
          channelId: data.channelId,
          profiles: data.profiles,
        };
      }
      return {
        status: 404,
        message: 'No config found',
      };
    } catch (error) {
      return {
        status: 400,
      };
    }
  };

  server.decorate('db', { save, get });

  next();
};

export default fp(dbPlugin);

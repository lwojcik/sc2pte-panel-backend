import mongoose from 'mongoose';
import fp from 'fastify-plugin';
import { ConfigObject } from '../@types/fastify';
import ChannelConfig from '../models/ChannelConfig';

export default fp(async (server, opts, next) => {
  mongoose.connection.once('open', () => {
    server.log.info('MongoDB event open');

    mongoose.connection.on('connected', () => {
      server.log.info('MongoDB event connected');
    });

    mongoose.connection.on('disconnected', () => {
      server.log.warn('MongoDB event disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      server.log.info('MongoDB event reconnected');
    });

    mongoose.connection.on('error', (err) => {
      server.log.error(`MongoDB event error: ${err}`);
    });
  });

  await mongoose.connect(
    opts.uri,
    {
      family: 4,
      useNewUrlParser: true,
      keepAlive: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  );

  const save = async (config: ConfigObject) => {
    // console.log(config);
    try {
      const { channelId, data } = config;
      console.log(data);
      await ChannelConfig.findOneAndUpdate(
        { channelId },
        { profiles: data },
        {
          upsert: true,
          runValidators: true,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  server.decorate('db', { save });

  next();
});
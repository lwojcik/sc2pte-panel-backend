const Mongoose = require('mongoose');
const fp = require('fastify-plugin');

const { ChannelConfig } = require('../models/v1.1/ChannelConfig');

module.exports = fp(async (server, opts, next) => {
  Mongoose.connection.on('connected', () => {
    server.log.info({ actor: 'MongoDB' }, 'connected');
  });

  Mongoose.connection.on('disconnected', () => {
    server.log.error({ actor: 'MongoDB' }, 'disconnected');
  });

  await Mongoose.connect(
    opts.uri,
    {
      useNewUrlParser: true,
      keepAlive: true,
    },
  );

  const models = {
    ChannelConfig,
  };

  server.decorate('db', { models });

  next();
});

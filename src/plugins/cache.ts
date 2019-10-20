import fp from 'fastify-plugin';

// import ChannelConfig from '../models/ChannelConfig'

export default fp(async (server, {}, /* opts, */ next) => {

  const purge = ({}) => true;

  server.decorate('cache', { purge });

  next();
});
const fp = require('fastify-plugin');

const schema = require('./schema');

const redisConfig = require('../../../../config/redis');
const bnetConfig = require('../../../../config/battlenet');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/viewer/get/:channelId',
    method: 'GET',
    schema,
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const { token } = request.headers;
      const validRequest = server.twitchEbs.validatePermission(token, channelId, ['viewer', 'broadcaster']);

      if (validRequest) {
        done();
      } else {
        server.log.error('invalid request');
        reply.code(400).send({
          status: 400,
          message: 'Bad request',
        });
      }
    },
    handler: async (request, reply) => {
      try {
        const { channelId } = request.params;
        const redisKey = `${redisConfig.viewKey}-${channelId}`;
        const isItCached = await server.cache.has(redisKey);
        if (isItCached) {
          server.log.info('sending cached response...');
          const cachedReply = await server.cache.get(redisKey);
          return reply.code(200).send(cachedReply.item);
        }
        server.log.info('generating and caching response...');

        if (bnetConfig.apiDisabledJanuary2020) {
          const responseObject = server.snapshot.getViewerData(channelId);
          await server.cache.set(redisKey, responseObject, redisConfig.replyCachePeriod);
          return reply.code(200).send(responseObject);
        }

        const channelConfigObject = await server.db.models.ChannelConfig.findOne({ channelId });

        if (channelConfigObject && channelConfigObject._doc) { // eslint-disable-line
          const channelConfig = channelConfigObject._doc; // eslint-disable-line
          const viewerData = await server.sc2pte.getViewerData(channelConfig);
          const responseObject = {
            status: 200,
            message: 'Config found',
            ...viewerData,
          };

          await server.cache.set(redisKey, responseObject, redisConfig.replyCachePeriod);
          return reply.code(200).send(responseObject);
        }
        return reply.code(404).send({
          status: 404,
          message: 'Account not found',
        });
      } catch (error) {
        server.log.error(error);
        return reply.code(400).send({
          status: 400,
          message: 'Bad request',
        });
      }
    },
  });
  next();
});

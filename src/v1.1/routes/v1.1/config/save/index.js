const fp = require('fastify-plugin');

const schema = require('./schema');

const redisConfig = require('../../../../config/redis');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/config/save/:channelId',
    method: 'POST',
    schema,
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const redisViewKey = `${redisConfig.viewKey}-${channelId}`;

      const { token } = request.headers;
      const validRequest = server.twitchEbs.validatePermission(token, channelId, 'broadcaster');

      if (validRequest) {
        const isItCached = server.cache.has(redisViewKey);
        if (isItCached) {
          server.log.info('invalidating cached view object...');
          server.cache.delete(redisViewKey);
        }
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

        const {
          regionid,
          realmid,
          playerid,
          selectedview,
          language,
        } = request.headers;

        await server.db.models.ChannelConfig.findOneAndUpdate(
          { channelId },
          {
            regionId: regionid,
            realmId: realmid,
            playerId: playerid,
            selectedView: selectedview || 'summary',
            language: language || 'en',
          },
          {
            upsert: true,
            runValidators: true,
          },
        );
        return reply.code(201).send({
          status: 201,
          message: 'Player config updated successfully',
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

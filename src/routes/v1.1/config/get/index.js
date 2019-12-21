const fp = require('fastify-plugin');

const schema = require('./schema');

const bnetConfig = require('../../../../config/battlenet');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/config/get/:channelId',
    method: 'GET',
    schema,
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const { token } = request.headers;
      const validRequest = server.twitchEbs.validatePermission(token, channelId, 'broadcaster');

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
        const { apiDisabledJanuary2020 } = bnetConfig;

        const channelConfig = await server.db.models.ChannelConfig.findOne({ channelId });

        if (channelConfig) {
          const {
            regionId,
            realmId,
            playerId,
            selectedView } = channelConfig._doc; // eslint-disable-line

          return reply.code(200).send({
            status: 200,
            message: 'Config found',
            channelId,
            regionId,
            realmId,
            playerId,
            selectedView,
            apiDisabledJanuary2020,
          });
        }

        return reply.code(404).send({
          status: 404,
          message: 'Account not found',
          apiDisabledJanuary2020,
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

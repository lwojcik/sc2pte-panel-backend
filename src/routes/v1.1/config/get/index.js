const fp = require('fastify-plugin');

const schema = require('./schema');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/config/get/:channelId',
    method: 'GET',
    schema,
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const { token } = request.headers;
      const validRequest = server.twitchExt.validatePermission(token, channelId, 'broadcaster');

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

        const channelConfig = await server.db.models.ChannelConfig.findOne({ channelId });

        if (channelConfig) {
          return reply.code(200).send({
            status: 200,
            message: 'Config found',
            channelId,
            regionId: channelConfig._doc.regionId, // eslint-disable-line
            realmId: channelConfig._doc.realmId, // eslint-disable-line
            playerId: channelConfig._doc.playerId, // eslint-disable-line
            selectedView: channelConfig._doc.selectedView, // eslint-disable-line
          });
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

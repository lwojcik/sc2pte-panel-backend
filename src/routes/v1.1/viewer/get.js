const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/viewer/get/:channelId',
    method: 'GET',
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const { token } = request.headers;
      const validRequest = server.twitchExt.validatePermission(token, channelId, ['viewer', 'broadcaster']);

      if (validRequest) {
        done();
      } else {
        server.log.error('invalid request');
        reply.badRequest();
      }
    },
    handler: async (request, reply) => {
      try {
        const { channelId } = request.params;

        const channelConfigObject = await server.db.models.ChannelConfig.findOne({ channelId });

        if (channelConfigObject._doc) { // eslint-disable-line
          return reply.code(200).send({
            status: 200,
            message: 'Config found',
            ...channelConfig._doc, // eslint-disable-line
          });
        }

        return reply.code(404).send({
          status: 404,
          message: 'Account not found',
        });
      } catch (error) {
        server.log.error(error);
        return reply.badRequest('Bad request');
      }
    },
  });
  next();
});

const fp = require('fastify-plugin');
// const Starcaft2API = require('starcraft2-api');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/config/get/:channelId',
    method: 'GET',
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const { token } = request.headers;
      const validRequest = server.twitchExt.validatePermission(token, channelId, 'broadcaster');

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

        const channelConfig = await server.db.models.ChannelConfig.findOne({ channelId });

        if (channelConfig) {
          // const { regionId, realmId, profileId } = channelConfig;
          // const profile = sc2api.queryProfile(regionI)
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

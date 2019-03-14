const fp = require('fastify-plugin');

const schema = require('./schema');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/config/save/:channelId',
    method: 'POST',
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

        const {
          regionid,
          realmid,
          playerid,
          selectedview,
        } = request.headers;

        await server.db.models.ChannelConfig.findOneAndUpdate(
          { channelId },
          {
            regionId: regionid,
            realmId: realmid,
            playerId: playerid,
            selectedView: selectedview || 'summary',
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

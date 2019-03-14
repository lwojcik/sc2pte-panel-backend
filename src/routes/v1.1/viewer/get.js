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
        const sampleView = {
          status: 200,
          player: {
            server: 'us',
            name: 'TOGrizzly',
            clan: {
              name: 'Blue Shell',
              tag: 'BluS',
            },
            rank: 'DIAMOND',
            portrait: 'https://static.starcraft2.com/starport/eadc1041-1c53-4c27-bf45-303ac5c6e33f/portraits/8-26.jpg',
          },
          ladders: {
            '1v1': {
              totalLadders: 1,
              topRankId: 4,
              topRank: 'DIAMOND',
              topTier: 1,
              topMMR: 3744,
              wins: 131,
              losses: 124,
            },
            archon: {
              totalLadders: 0,
              topRankId: -1,
              topRank: '',
              topTier: 1,
              topMMR: 0,
              wins: 0,
              losses: 0,
            },
            '2v2': {
              totalLadders: 2,
              topRankId: 4,
              topRank: 'DIAMOND',
              topTier: 1,
              topMMR: 3073,
              wins: 7,
              losses: 18,
            },
            '3v3': {
              totalLadders: 1,
              topRankId: 1,
              topRank: 'SILVER',
              topTier: 1,
              topMMR: 2876,
              wins: 6,
              losses: 3,
            },
            '4v4': {
              totalLadders: 0,
              topRankId: -1,
              topRank: '',
              topTier: 1,
              topMMR: 0,
              wins: 0,
              losses: 0,
            },
          },
        };

        if (channelConfigObject._doc) { // eslint-disable-line
          return reply.code(200).send({
            status: 200,
            message: 'Config found',
            ...sampleView, // eslint-disable-line
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

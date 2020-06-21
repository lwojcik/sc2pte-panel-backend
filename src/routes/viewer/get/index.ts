import fp from 'fastify-plugin';
import schema from './schema';

export default fp((server, {}, next) => {
  server.get(
    '/v2/viewer/:channelId',
    {
      schema,
      preValidation: [server.authenticateViewer],
    },
    async (request, reply) => {
      try {
        const { channelId } = request.params;
        const { profiles } = await server.playerConfig.get(channelId);
        const data = await server.viewer.getData(profiles);
        reply.code(200).send({
          channelId,
          data,
        });
      } catch (error) {
        console.log(error);
        reply.send({
          status: 400,
          message: 'Data fetch error',
        });
      }
    });

  next();
});

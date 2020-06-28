import fp from 'fastify-plugin';
import schema from './schema';

export default fp((server, opts, next) => {
  const { urlPrefix } = opts;
  server.get(
    `/${urlPrefix}/viewer/:channelId`,
    {
      schema,
      preValidation: [server.twitch.validateViewer],
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
        server.log.error(error);
        reply.send({
          status: 400,
          message: 'Data fetch error',
        });
      }
    });

  next();
});

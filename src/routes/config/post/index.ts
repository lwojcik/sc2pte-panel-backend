import fp from 'fastify-plugin';
import schema from './schema';

export default fp((server, opts, next) => {
  const { urlPrefix } = opts;
  server.post(
    `/${urlPrefix}/config/:channelId`,
    {
      schema,
      preValidation: [server.twitch.validateConfig],
    },
    async (request, reply) => {
      try {
        const channelId = request.params.channelId;
        const data = JSON.parse(request.body);
        const configSaved = await server.playerConfig.save({ channelId, data });

        if (configSaved) {
          server.viewer.getFreshData(data, `viewer-${channelId}`);
          server.cloudflare.purgeByChannelId(channelId);

          reply.code(200).send({
            status: 200,
            message: 'Config saved',
          });
        } else {
          reply.code(400).send({
            status: 400,
            message: 'Failed to save config',
          });
        }
      } catch (error) {
        server.log.error(error);
        reply.code(400).send({
          status: 400,
          message: 'Incorrect or malformed request',
        });
      }
    },
  );
  next();
});

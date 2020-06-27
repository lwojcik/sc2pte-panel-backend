import fp from 'fastify-plugin';
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get(
    '/v2/config/:channelId',
    { // schema,
      preValidation: [server.twitch.validateConfig],
    },
    async (request, reply) => {
      const { channelId } = request.params;
      try {
        const data = await server.playerConfig.get(channelId);
        reply.code(data.status).send(data);
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

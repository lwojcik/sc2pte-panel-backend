import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.post(
    "/config/:channelId",
    {
      // schema,
      preValidation: [server.authenticateConfig],
    },
    async (request, reply) => {
      try {
        const channelId = request.params.channelId;
        const data = JSON.parse(request.body);
        const configSaved = await server.playerConfig.save({ channelId, data });

        if (configSaved) {
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
  });
  next();
});

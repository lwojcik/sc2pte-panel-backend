import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.post("/config",
    {
      // schema,
      preValidation: async (request, reply, done) => {
        try {
          const { channelid, token } = request.headers;
          const valid = await server.twitchEbs.validatePermission(
            token,
            channelid,
            'broadcaster',
          );

          if (valid) {
            done();
          } else {
            reply.code(401).send({
              status: 401,
              message: 'Unauthorized',
            });
          }
        } catch (error) {
          reply.code(401).send({
            status: 401,
            message: 'Unauthorized',
          });
        }
      },
    },
    async (request, reply) => {
      try {
        const channelId = request.headers.channelid;
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

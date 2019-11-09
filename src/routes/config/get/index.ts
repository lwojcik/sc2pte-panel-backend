import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get(
  "/config/:channelId",
  { // schema,
    preValidation: [server.authenticateConfig],
  },
  async (request, reply) => {
    const { channelId } = request.params;
    try {
      const data = await server.playerConfig.get(channelId);
      console.log(data);
      reply.code(data.status).send(data);
    } catch (error) {
      server.log.error(error);
      reply.code(400).send({
        status: 400,
        message: 'Incorrect or malformed request',
      });
    }
    // reply.code(200).send({
    //   status: 200,
    //   channelId,
    //   profiles: [
    //     {
    //       regionId: 1,
    //       realmId: 1,
    //       profileId: "1084304",
    //     },
    //     {
    //       regionId: 1,
    //       realmId: 1,
    //       profileId: "6615271",
    //     },
    //     {
    //       regionId: 2,
    //       realmId: 1,
    //       profileId: "5593296",
    //     },
    //     {
    //       regionId: 1,
    //       realmId: 1,
    //       profileId: "2840641",
    //     },
    //     {
    //       regionId: 2,
    //       realmId: 1,
    //       profileId: "4682128",
    //     },
    //   ],
    //   // profiles: [],
    // });
  });
  next();
});

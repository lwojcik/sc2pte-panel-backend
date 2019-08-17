import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get("/viewer/:channelId", /* { schema }, */ (request, reply) => {
    const { channelId } = request.params;
    reply.code(200).send({
      status: 200,
      message: "getViewer",
      channelId,
    });
  });
  next();
});

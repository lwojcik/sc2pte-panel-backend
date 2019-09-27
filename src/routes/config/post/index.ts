import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.post("/config", /* { schema }, */ (request, reply) => {
    const { channelId } = request.params;
    const auth = request.headers;
    const data = JSON.parse(request.body);
    console.log(auth);
    console.log(data);
    reply.code(200).send({
      status: 200,
      message: "postConfig",
      channelId,
    });
  });
  next();
});

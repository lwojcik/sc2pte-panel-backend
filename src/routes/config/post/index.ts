import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.post("/config", /* { schema }, */ ({}, reply) => {
    reply.code(200).send({
      status: 200,
      message: "postConfig",
    });
  });
  next();
});

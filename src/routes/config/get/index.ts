import fp from "fastify-plugin";
// import schema from "./schema";

export default fp((server, {}, next) => {
  server.get("/config", /* { schema }, */ ({}, reply) => {
    reply.code(200).send({
      status: 200,
      message: "getConfig",
    });
  });
  next();
});

import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import schema from "./schema";

// eslint-disable-next-line no-empty-pattern
const route: FastifyPluginCallback = (server, {}, next) => {
  server.get(
    "/status",
    { schema },
    // eslint-disable-next-line no-empty-pattern
    ({}, reply) => {
      reply.code(200).send({
        status: 200,
        message: "ok",
        timestamp: new Date(),
      });
    }
  );
  next();
};

export default fp(route);

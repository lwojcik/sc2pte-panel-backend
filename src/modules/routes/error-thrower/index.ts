import fastify from "fastify";
import fp = require("fastify-plugin");
import { Server, IncomingMessage, ServerResponse } from "http";

export default fp(async (server, {/*opts*/}, next) => {
  server.route({
    url: "/error-thrower",
    method: ["GET"],
    handler: async ({/*req*/}, reply) => {
      throw new Error("Oh no, something bad happened, try to debug me");
      return reply.send({ date: new Date(), works: true });
    }
  });
  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

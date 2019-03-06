import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from "http";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async (server, {/*opts*/}, next) => {
  server.route({
    url: "/status",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    handler: async ({/*request*/}, reply) => {
      return reply.send({ date: new Date(), works: true });
    }
  });
  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from "http";
import fp from "fastify-plugin";

export default fp(async (server, {}, next) => {
  server.route({
    url: "/viewer",
    logLevel: "warn",
    method: ["GET", "HEAD"],
    handler: async ({}, reply) => {
      return reply.send({ date: new Date(), status: "/viewer" });
    }
  });
  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

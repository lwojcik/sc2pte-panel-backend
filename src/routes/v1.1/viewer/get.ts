import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from "http";
import fp from "fastify-plugin";

export default fp(async (server, {}, next) => {
  server.route({
    url: "/v1.1/viewer",
    logLevel: "warn",
    method: "GET",
    handler: async ({}, reply) => {
      return reply.send({ date: new Date(), status: "/v1.1/viewer" });
    }
  });
  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

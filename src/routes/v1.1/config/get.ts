import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from "http";
import fp from "fastify-plugin";

export default fp(async (server, {/*opts*/}, next) => {
  // const opts = {
  //   schema: {
  //     response: {
  //       200: {
  //         type: 'object',
  //         properties: {
  //           status: { type: 'integer' },
  //           message: { type: 'string' },
  //           channelId: { type: 'integer' },
  //           regionId: { type: 'integer' },
  //           realmId: { type: 'integer' },
  //           playerId: { type: 'integer' },
  //           selectedView: { type: 'string' },
  //         }
  //       }
  //     }
  //   }
  // }

  server.get('/v1.1/config/get/:channelId', ({/*request*/}, reply) => {
    // const { channelId } = request.params;
    reply.send({
      status: 404,
      message: 'Account not found',
    });
  });

  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

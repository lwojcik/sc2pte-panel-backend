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

  server.route({
    url: "/v1.1/config/save/:channelId",
    method: "POST",
    preHandler: (request, {/*reply*/}, done) => {
      console.log('prehandling...');
      // verify jwt
      // verify if broadcaster
      console.log(request.headers);
      done();
    },
    handler: async (req, reply) => {
      req.log.info(`Saving config for channelId: ${req.params.channelId}`);

      // save config

      return reply.send({
        status: 201,
        message: 'Player config updated successfully',
      });
    },
  });
  // server.post('/v1.1/config/save/:channelId', (request, reply) => {
  //   // const { channelId } = request.params;
  //   console.log(request.params);
  //   console.log(request.headers);
  //   console.log(request.body);
  //   reply.send({
  //     status: 201,
  //     message: 'Player config updated successfully',
  //   });
  // });

  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

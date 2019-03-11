import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from "http";
import fp from "fastify-plugin";
import jsonwebtoken from 'jsonwebtoken';

import twitchConfig from '../../../config/shared/api/twitch';
import { TwitchPayload } from '../../../modules/jwt';
import * as jwtTools from '../../../modules/jwt';
// import * as twitchTools from '../../../modules/twitch';

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
    preHandler: (request, reply, done) => {
      const { channelId } = request.params;
      const { token } = request.headers;
      const payload = <TwitchPayload>jsonwebtoken.verify(token, twitchConfig.sharedSecret);
      const isTokenValid = jwtTools.validateToken(token, channelId, "broadcaster");
      const sufficientPermissions = jwtTools.validateTokenPermissions(payload, channelId, "broadcaster");

      if (isTokenValid && sufficientPermissions) {
        done();
      } else {
        reply.send({
          status: 400,
          message: 'Bad request'
        });
      }
    },
    handler: async (request, reply) => {
      // save config
      const { channelId } = request.params;
      const {
        regionid,
        realmid,
        playerid,
      } = request.headers;
  
      const configObject = {
        channelId,
        regionId: regionid,
        realmId: realmid,
        playerId: playerid,
      };

      // const response = await twitchTools.saveConfig(configObject);
      // return reply.send(response);
      return reply.send({
        status: 201,
        message: 'Player config updated successfully',
      });
    },
  });
  next();
}) as fastify.Plugin<Server, IncomingMessage, ServerResponse, {}>;

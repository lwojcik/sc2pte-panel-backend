// const fastify = require('fastify');
const fp = require('fastify-plugin');

// import twitchConfig from '../../../config/shared/api/twitch';
// import { TwitchPayload } from '../../../modules/jwt';
// import * as jwtTools from '../../../modules/jwt';
// import * as twitchTools from '../../../modules/twitch';

module.exports = fp(async (server, opts, next) => {
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
    url: '/v1.1/config/save/:channelId',
    method: 'POST',
    // preHandler: (request, reply, done) => {
    //   try {
    //     server.info('prehandler');
    //     const { token } = request.headers;
    //     console.log(token); // eslint-disable-line
    //     const decodedToken = server.jwt.verify(token);
    //     console.log(decodedToken); // eslint-disable-line
    //     done();
    //   } catch (error) {
    //     server.log.error(error);
    //     reply.badRequest();
    //   }
    //   // const { channelId } = request.params;
    //   // const { token } = request.headers;

    //   // try {
    //   //   const secret = twitchConfig.sharedSecret;
    //   //   const payload = jsonwebtoken.verify(token, secret);
    //   //   console.log(payload);
    //   //   done();
    //   // } catch (error) {
    //   //   reply.send({
    //   //     status: 400,
    //   //     message: 'Bad request',
    //   //   });
    //   // }

    //   // console.log(request.headers.token);
    //   // console.log(twitchConfig.sharedSecret);
    //   // const { channelId } = request.params;
    //   // const { token } = request.headers;
    //   // const payload = <TwitchPayload>jsonwebtoken.verify(token, twitchConfig.sharedSecret);
    //   // const isTokenValid = jwtTools.validateToken(token, channelId, "broadcaster");
    //   // const sufficientPermissions =
    //   // jwtTools.validateTokenPermissions(payload, channelId, "broadcaster");

    //   // if (isTokenValid && sufficientPermissions) {
    //   //   console.log('all good');
    //   //   done();
    //   // } else {
    //   //   reply.send({
    //   //     status: 400,
    //   //     message: 'Bad request'
    //   //   });
    //   // }
    // },
    handler: async (request, reply) => {
      // save config
      server.info('handler!');
      // const { channelId } = request.params;
      // const {
      //   regionid,
      //   realmid,
      //   playerid,
      //   selectedview,
      // } = request.headers;

      // const configObject = {
      //   channelId,
      //   selectedView: selectedview,
      //   regionId: regionid,
      //   realmId: realmid,
      //   playerId: playerid,
      // };

      // const response = await twitchTools.saveConfig(configObject);
      // return reply.send(response);
      reply.send({
        status: 201,
        message: 'Player config updated successfully',
      });
    },
  });
  next();
});

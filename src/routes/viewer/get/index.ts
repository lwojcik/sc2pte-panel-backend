import fp from 'fastify-plugin';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

const urlPrefix = `${process.env.API_URL_PREFIX}${process.env.API_URL_PREFIX ? '/' : ''}`;
const urlPath = 'viewer/:channelId';
const url = `/${urlPrefix}${urlPath}`;

const method = 'GET';

const send = async (
  status: number,
  data: object,
  reply: FastifyReply<ServerResponse>
  ) => reply.code(status).send({
  status,
  data,
});

const send200 = (data: object, reply: FastifyReply<ServerResponse>) => {
  send(200, data, reply);
}

const handleRoute = (request:FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => {
  console.log(request);
  return send200({ lorem: 'ipsum' }, reply);
}

// const handle400

// const schema = require('./schema');

// const redisConfig = require('../../../../config/redis');

export default fp(async (server, {}, next) => {
  server.route({
    url,
    method,
    // schema,
    handler: handleRoute,
  });
  next();
});

// module.exports = fp(async (server, opts, next) => {
//   server.route({
//     url: '/v1.1/viewer/get/:channelId',
//     method: 'GET',
//     schema,
//     preHandler: (request, reply, done) => {
//       const { channelId } = request.params;
//       const { token } = request.headers;
//       const validRequest = server.twitchEbs.validatePermission(token, channelId, ['viewer', 'broadcaster']);

//       if (validRequest) {
//         done();
//       } else {
//         server.log.error('invalid request');
//         reply.code(400).send({
//           status: 400,
//           message: 'Bad request',
//         });
//       }
//     },
//     handler: async (request, reply) => {
//       try {
//         const { channelId } = request.params;
//         const redisKey = `${redisConfig.viewKey}-${channelId}`;
//         const isItCached = await server.cache.has(redisKey);
//         if (isItCached) {
//           server.log.info('sending cached response...');
//           const cachedReply = await server.cache.get(redisKey);
//           return reply.code(200).send(cachedReply.item);
//         }
//         server.log.info('generating and caching response...');
//         const channelConfigObject = await server.db.models.ChannelConfig.findOne({ channelId });

//         if (channelConfigObject._doc) { // eslint-disable-line no-underscore-dangle
//           const channelConfig = channelConfigObject._doc; // eslint-disable-line
//           const viewerData = await server.sc2pte.getViewerData(channelConfig);
//           const responseObject = {
//             status: 200,
//             message: 'Config found',
//             ...viewerData,
//           };

//           await server.cache.set(redisKey, responseObject, redisConfig.replyCachePeriod);
//           return reply.code(200).send(responseObject);
//         }
//         return reply.code(404).send({
//           status: 404,
//           message: 'Account not found',
//         });
//       } catch (error) {
//         server.log.error(error);
//         return reply.code(400).send({
//           status: 400,
//           message: 'Bad request',
//         });
//       }
//     },
//   });
//   next();
// });

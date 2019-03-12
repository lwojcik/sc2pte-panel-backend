const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  server.route({
    url: '/v1.1/viewer',
    logLevel: 'warn',
    method: 'GET',
    handler: (request, reply) => reply.send({ date: new Date(), status: '/v1.1/viewer' }),
  });
  next();
});

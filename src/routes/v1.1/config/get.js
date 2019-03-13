const fp = require('fastify-plugin');

module.exports = fp(async (server, opts, next) => {
  server.get('/v1.1/config/get/:channelId', (request, reply) => {
    // const { channelId } = request.params;
    reply.send({
      status: 404,
      message: 'Account not found',
    });
  });

  next();
});

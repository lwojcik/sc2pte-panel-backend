import fp from 'fastify-plugin';

export default fp(async (server, {}, next) => {
  const methods = {
    get: ({}) => true,
    set: ({}) => true,
    has: ({}) => true,
  };

  server.decorate('redis', methods);

  next();
});

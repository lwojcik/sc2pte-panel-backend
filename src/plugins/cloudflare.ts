import fp from 'fastify-plugin';

export default fp(async (server, {}, next) => {
  const methods = {
    purge: ({}) => true,
  };

  server.decorate('cloudflare', methods);

  next();
});

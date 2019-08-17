import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import routes from './routes';

// interface ServerOptions extends Sc2ApiOptions {
//   bas: BasOptions;
// }

const api = fp(
  (fastify: FastifyInstance, /* opts: any, */ {}, next: Function) => {
    fastify.register(routes.status);
    fastify.register(routes.config.get);
    fastify.register(routes.config.post);
    fastify.register(routes.viewer.get);
    next();
  },
);

export = api;

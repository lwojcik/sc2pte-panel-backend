import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { default as statusRoutes } from './routes/status/index';
import { default as configRoutes } from './routes/config';
import { default as viewerRoutes } from './routes/viewer';
import cache from './plugins/cache';
import db from './plugins/db';
import config from './plugins/config';

interface ServerOptions {
  db: {
    uri: String;
  },
}

const api = fp(
  (fastify: FastifyInstance, opts: ServerOptions, next: Function) => {
    fastify.register(cache);
    fastify.register(db, opts.db);
    fastify.register(config);
    fastify.register(statusRoutes);
    fastify.register(configRoutes.get);
    fastify.register(configRoutes.post);
    fastify.register(viewerRoutes.get);
    next();
  },
);

export = api;

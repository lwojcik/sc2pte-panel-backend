import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { default as statusRoutes } from './routes/status/index';
import { default as configRoutes } from './routes/config';
import { default as viewerRoutes } from './routes/viewer';
import cache from './plugins/cache';
import db from './plugins/db';
import sas, { SasOptions } from './plugins/sas';
import playerConfig from './plugins/playerConfig';
import viewer from './plugins/viewer';
import twitchConfigValidator from './plugins/twitchConfigValidator';

interface ServerOptions {
  app: {
    urlPrefix: string;
  };
  db: {
    uri: string;
  };
  twitch: {
    secret: string;
    enableOnAuthorized: boolean;
  };
  sas: SasOptions;
  maxProfiles: number;
}

const api = fp(
  (
    fastify: FastifyInstance,
    opts: ServerOptions,
    next: CallableFunction,
  ) => {
    const {
      app,
      maxProfiles,
      twitch,
    } = opts;
    fastify.register(cache);
    fastify.register(db, {
      ...opts.db,
      maxProfiles,
    });
    fastify.register(sas, opts.sas);
    fastify.register(playerConfig, { maxProfiles });
    fastify.register(twitchConfigValidator, twitch);
    fastify.register(viewer);
    fastify.register(statusRoutes);
    fastify.register(configRoutes.get, { urlPrefix: app.urlPrefix });
    fastify.register(configRoutes.post, { urlPrefix: app.urlPrefix });
    fastify.register(viewerRoutes.get, { urlPrefix: app.urlPrefix });
    next();
  },
);

export = api;

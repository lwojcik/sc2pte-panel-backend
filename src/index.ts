import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import statusRoutes from './routes/status/index';
import configRoutes from './routes/config';
import viewerRoutes from './routes/viewer';
import db from './plugins/db';
import sas, { SasOptions } from './plugins/sas';
import cloudflare from './plugins/cloudflare';
import playerConfig from './plugins/playerConfig';
import viewer from './plugins/viewer';
import twitchConfigValidator, { TwitchPluginOptions } from './plugins/twitchConfigValidator';

interface ServerOptions {
  app: {
    urlPrefix: string;
  };
  db: {
    uri: string;
  };
  redis: {
    ttl: number;
  };
  twitch: TwitchPluginOptions;
  sas: SasOptions;
  maxProfiles: number;
  cloudflare: {
    enable: boolean;
    token: string;
    zoneId: string;
    productionDomain: string;
    viewerRoute: string;
  };
}

const api = fp(
  (
    fastify: FastifyInstance,
    opts: ServerOptions,
    next: CallableFunction,
  ) => {
    const {
      app,
      redis,
      maxProfiles,
      twitch,
    } = opts;
    const { urlPrefix } = app;
    fastify.register(db, {
      ...opts.db,
      maxProfiles,
    });

    if (opts.cloudflare.enable) {
      fastify.register(cloudflare, opts.cloudflare);
    }

    fastify.register(sas, opts.sas);
    fastify.register(playerConfig, { maxProfiles });
    fastify.register(twitchConfigValidator, twitch);
    fastify.register(viewer, { ttl: redis.ttl });
    fastify.register(statusRoutes);
    fastify.register(configRoutes.get, { urlPrefix });
    fastify.register(configRoutes.post, { urlPrefix });
    fastify.register(viewerRoutes.get, { urlPrefix });
    next();
  },
);

export = api;

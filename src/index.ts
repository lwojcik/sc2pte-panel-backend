import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp, { nextCallback } from 'fastify-plugin';
import { default as twitchEbsTools } from 'fastify-twitch-ebs-tools';

import { default as statusRoutes } from './routes/status/index';
import { default as configRoutes } from './routes/config';
import { default as viewerRoutes } from './routes/viewer';
import cache from './plugins/cache';
import db from './plugins/db';
import playerConfig from './plugins/playerConfig';
import { IncomingMessage } from 'http';

interface ServerOptions {
  db: {
    uri: string;
  },
  twitch: {
    secret: string;
    enableOnauthorized: boolean;
  }
}

const api = fp(
  (fastify: FastifyInstance, opts: ServerOptions, next: Function) => {
    fastify.register(cache);
    fastify.register(db, opts.db);
    fastify.register(playerConfig);
    fastify.register(statusRoutes);
    fastify.register(twitchEbsTools, {
      secret: opts.twitch.secret,
      disabled: !opts.twitch.enableOnauthorized,
    });
    fastify.decorate("authenticateConfig", (request: FastifyRequest, reply: FastifyReply<IncomingMessage>, done: nextCallback) => {
      try {
        const { channelid, token } = request.headers;
        console.log(request.headers);
        const valid = fastify.twitchEbs.validatePermission(
          token,
          channelid,
          'broadcaster',
        );

        if (valid) {
          done();
        } else {
          reply.code(401).send({
            status: 401,
            message: 'Unauthorized',
          });
        }
      } catch (error) {
        reply.code(401).send({
          status: 401,
          message: 'Unauthorized',
        });
      }
    });
    fastify.register(configRoutes.get);
    fastify.register(configRoutes.post);
    fastify.register(viewerRoutes.get);
    next();
  },
);

export = api;
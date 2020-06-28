import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import twitchEbsTools from 'fastify-twitch-ebs-tools';
import { ServerResponse } from 'http';

export interface TwitchPluginOptions {
  secret: string;
  enableOnAuthorized: boolean;
}

export default fp(async (server, opts: TwitchPluginOptions, next) => {
  const disabled = !opts.enableOnAuthorized;
  console.log(opts.enableOnAuthorized);
  server.register(twitchEbsTools, {
    secret: opts.secret,
    disabled,
  });

  const handle401 = (reply: FastifyReply<ServerResponse>) =>
    reply.code(401).send({
      status: 401,
      message: 'Unauthorized',
    });

  const validatePermission = (
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>,
    done: CallableFunction,
    roles: string | string[],
  ) => {
    try {
      const channelIdInUrl = request.params.channelId;
      const { channelid, token } = request.headers;
      const channelIdCorrect = disabled ? true : channelIdInUrl === channelid;
      const payloadValid = server.twitchEbs.validatePermission(
        token,
        channelid,
        roles,
      );

      if (channelIdCorrect && payloadValid) {
        done();
      } else {
        handle401(reply);
      }
    } catch (error) {
      handle401(reply);
    }
  };

  server.decorate(
    'twitch',
    {
      validateConfig: (
        request: FastifyRequest,
        reply: FastifyReply<ServerResponse>,
        done: CallableFunction,
      ) =>
        validatePermission(request, reply, done, ['broadcaster']),
      validateViewer: (
          request: FastifyRequest,
          reply: FastifyReply<ServerResponse>,
          done: CallableFunction,
        ) =>
          validatePermission(request, reply, done, ['viewer', 'broadcaster']),
    },
  );

  next();
});

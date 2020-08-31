import {
  FastifyPlugin,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import fp from 'fastify-plugin';
import twitchEbsTools from 'fastify-twitch-ebs-tools';

export interface TwitchPluginOptions {
  secret: string;
  enableOnAuthorized: boolean;
}

interface ViewerRequest {
  Params: {
    channelId: string;
  };
  Headers: {
    channelid: string;
    token: string;
  };
}

const twitchConfigValidatorPlugin: FastifyPlugin<TwitchPluginOptions>
  = (server, opts, next) => {
    const disabled = !opts.enableOnAuthorized;

    server.register(twitchEbsTools, {
      secret: opts.secret,
      disabled,
    });

    const handle401 = (reply: FastifyReply) =>
      reply.code(401).send({
        status: 401,
        message: 'Unauthorized',
      });

    const validatePermission = (
      request: FastifyRequest<ViewerRequest>,
      reply: FastifyReply,
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
          request: FastifyRequest<ViewerRequest>,
          reply: FastifyReply,
          done: CallableFunction,
        ) =>
          validatePermission(request, reply, done, ['broadcaster']),
        validateViewer: (
            request: FastifyRequest<ViewerRequest>,
            reply: FastifyReply,
            done: CallableFunction,
          ) =>
            validatePermission(request, reply, done, ['viewer', 'broadcaster']),
      },
    );

    next();
  };

export default fp(twitchConfigValidatorPlugin);

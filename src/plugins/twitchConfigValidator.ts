import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import twitchEbsTools from 'fastify-twitch-ebs-tools';
import { ServerResponse } from 'http';

interface PluginOptions {
  secret: string;
  enableOnAuthorized: boolean;
}

export default fp(async (server, opts: PluginOptions) => {

  server.register(twitchEbsTools, {
    secret: opts.secret,
    disabled: !opts.enableOnAuthorized,
  });

  server.decorate(
    "authenticateConfig",
    (request: FastifyRequest, reply: FastifyReply<ServerResponse>, done: CallableFunction) => {
      try {
        const channelIdInUrl = request.params.channelId;
        const { channelid, token } = request.headers;

        const channelIdCorrect = channelIdInUrl === channelid;
        const payloadValid = server.twitchEbs.validatePermission(
          token,
          channelid,
          'broadcaster',
        );

        if (channelIdCorrect && payloadValid) {
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
});
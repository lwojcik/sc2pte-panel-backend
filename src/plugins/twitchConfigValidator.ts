import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import twitchEbsTools from 'fastify-twitch-ebs-tools';
import { ServerResponse } from 'http';

interface PluginOptions {
  secret: string;
  enableOnAuthorized: boolean;
}

export default fp(async (server, opts: PluginOptions, next) => {
  server.register(twitchEbsTools, {
    secret: opts.secret,
    disabled: !opts.enableOnAuthorized,
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
    roles: string | string[]) => {
      try {
        const channelIdInUrl = request.params.channelId;
        console.log(request.headers);
        const { channelid, token } = request.headers;
        const channelIdCorrect = channelIdInUrl === channelid;
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
    }

  server.decorate(
    "authenticateConfig",
    (request: FastifyRequest,
      reply: FastifyReply<ServerResponse>,
      done: CallableFunction) =>
        validatePermission(request, reply, done, [ "broadcaster"]));

  server.decorate(
    "authenticateViewer",
    (request: FastifyRequest,
      reply: FastifyReply<ServerResponse>,
      done: CallableFunction) =>
        validatePermission(request, reply, done, [ "viewer", "broadcaster"]));

  next();
});
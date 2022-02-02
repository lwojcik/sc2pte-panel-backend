import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import schema from "./schema";
import { RouteOptions, RouteParams } from "../../../@types/fastify.d";

const route: FastifyPluginCallback<RouteOptions> = (server, opts, next) => {
  const { urlPrefix } = opts;
  server.post<{
    Params: RouteParams;
    Body: string;
  }>(
    `/${urlPrefix}/config/:channelId`,
    {
      schema,
      preValidation: [server.twitch.validateConfig],
    },
    async (request, reply) => {
      try {
        const { channelId } = request.params;
        const data = JSON.parse(request.body);
        const configSaved = await server.playerConfig.save({ channelId, data });

        if (configSaved) {
          server.viewer.getFreshData(data, `viewer-${channelId}`);
          server.cloudflare.purgeByChannelId(channelId);

          reply.code(200).send({
            status: 200,
            message: "Config saved",
          });
        } else {
          reply.code(400).send({
            status: 400,
            message: "Failed to save config",
          });
        }
      } catch (error) {
        server.log.error(error);
        reply.code(400).send({
          status: 400,
          message: "Incorrect or malformed request",
        });
      }
    }
  );
  next();
};

export default fp(route);

import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import schema from "./schema";
import { RouteOptions, RouteParams } from "../../../@types/fastify.d";

const route: FastifyPluginCallback<RouteOptions> = (server, opts, next) => {
  const { urlPrefix } = opts;
  server.get<{
    Params: RouteParams;
  }>(
    `/${urlPrefix}/viewer/:channelId`,
    {
      schema,
      preValidation: [server.twitch.validateViewer],
    },
    async (request, reply) => {
      try {
        const { channelId } = request.params;
        const { profiles } = await server.playerConfig.get(channelId);
        const data = await server.viewer.getData({
          channelId,
          profiles,
        });
        reply.code(200).send({
          channelId,
          data,
        });
      } catch (error) {
        server.log.error(error);
        reply.send({
          status: 400,
          message: "Data fetch error",
        });
      }
    }
  );

  next();
};

export default fp(route);

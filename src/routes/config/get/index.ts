import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import schema from "./schema";
import { RouteOptions } from "../../../@types/fastify.d";

interface RouteParams {
  channelId: string;
}

const route: FastifyPluginCallback<RouteOptions> = (server, opts, next) => {
  const { urlPrefix } = opts;
  server.get<{
    Params: RouteParams;
  }>(
    `/${urlPrefix}/config/:channelId`,
    {
      schema,
      preValidation: [server.twitch.validateConfig],
    },
    async (request, reply) => {
      const { channelId } = request.params;
      try {
        const data = await server.playerConfig.get(channelId);
        reply.code(data.status).send(data);
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

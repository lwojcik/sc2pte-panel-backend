import fp from "fastify-plugin";
// import schema from "./schema";
import { saveConfig } from '../../../controllers/config';

export default fp((server, {}, next) => {
  server.post("/config", /* { schema }, */ async (request, reply) => {
    try {
      const channelId = request.headers.channelid;
      const data = JSON.parse(request.body);
      const configSaved = await saveConfig({ channelId, data });

      if (configSaved) {
        reply.code(200).send({
          status: 200,
          message: 'Config saved',
        });
      } else {
        reply.code(400).send({
          status: 400,
          message: 'Failed to save config',
        });
      }
    } catch (error) {
      reply.code(400).send({
        status: 400,
        message: 'Incorrect or malformed request',
      });
    }
  });
  next();
});

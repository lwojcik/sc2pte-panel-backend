import fp from "fastify-plugin";
// import schema from "./schema";
import { saveConfig } from '../../../controllers/config';

export default fp((server, {}, next) => {
  server.post("/config", /* { schema }, */ async (request, reply) => {
    const { channelid } = request.headers;
    const data = JSON.parse(request.body);

    const savedConfigStatus = await saveConfig(channelid, data);
    reply.code(savedConfigStatus.status).send(savedConfigStatus);
  });
  next();
});

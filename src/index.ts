import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
// import * as config from "config";
import statusRoutes from "./modules/routes/status";
import vehiclesRoutes from "./modules/routes/vehicles";
import errorThrowerRoutes from "./modules/routes/error-thrower";
// import db from "./modules/db";

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({logger:true});

server.register(require("fastify-blipp"));
// server.register(db, config.get('db'));
server.register(vehiclesRoutes);
server.register(statusRoutes);
server.register(errorThrowerRoutes);

const start = async () => {
  try {
    await server.listen(8884, "0.0.0.0");
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

start();
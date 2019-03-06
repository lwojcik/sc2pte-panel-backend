require('dotenv').config();
import fastify from "fastify";
const fastifyBlipp = require("fastify-blipp"); // no type definitions here :-(
import { Server, IncomingMessage, ServerResponse } from "http";

import appConfig from './config/shared/app';
// import dbConfig from './config/shared/database';

import statusRoutes from "./modules/routes/status";
import viewerRoutes from "./modules/routes/viewer";
import configRoutes from "./modules/routes/config";

// import db from "./modules/db";

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger:true
});

server.register(fastifyBlipp);
// server.register(db, dbConfig.connectionString);
server.register(statusRoutes);
server.register(configRoutes);
server.register(viewerRoutes);

const start = async () => {
  try {
    await server.listen(appConfig.port);
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
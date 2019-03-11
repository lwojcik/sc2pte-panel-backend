require('dotenv').config();
import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import cors from 'fastify-cors';
import rateLimit from 'fastify-rate-limit';

import appConfig from './config/shared/app';
import dbConfig from './config/shared/database';
// import twitchConfig from './config/shared/api/twitch';

import getViewerRoutes from "./routes/v1.1/viewer/get";
import saveConfigRoutes from "./routes/v1.1/config/save";
import getConfigRoutes from "./routes/v1.1/config/get";

import db from "./modules/db";


/* Imports without type definitions */

const blipp = require("fastify-blipp");
const healthcheck = require('fastify-healthcheck');
const compression = require('fastify-compress');
const helmet = require('fastify-helmet');
const sensible = require('fastify-sensible');
const auth = require('fastify-auth');

/* Server instance */

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true
});

/* Plugins */

server.register(compression);
server.register(blipp);
server.register(cors, {
  origin: '*',
  methods: [ 'GET', 'POST' ],
  credentials: true,
  allowedHeaders: [
    'X-Requested-With',
    'content-type',
    'channelId',
    'regionId',
    'realmId',
    'playerId',
    'selectedView',
    'token',
  ],
});
server.register(helmet);
server.register(db, { uri: dbConfig.connectionString });
server.register(healthcheck, { healthcheckUrl: '/status' });
server.register(rateLimit, { max: 100 /* per minute */ });
server.register(sensible);
server.register(auth);

/* Routes */

server.register(getViewerRoutes);
server.register(getConfigRoutes);
server.register(saveConfigRoutes);

/* Server invocation */

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

/* Exception handling */

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

/* Here we go! */

start();
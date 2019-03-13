require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fastify = require('fastify');
const cors = require('fastify-cors');
const rateLimit = require('fastify-rate-limit');
const blipp = require('fastify-blipp');
const healthcheck = require('fastify-healthcheck');
const compression = require('fastify-compress');
const helmet = require('fastify-helmet');
const sensible = require('fastify-sensible');
const auth = require('fastify-auth');

const twitchExt = require('./plugins/twitchExt');

const appConfig = require('./config/shared/app');
const dbConfig = require('./config/shared/database');
const twitchConfig = require('./config/shared/api/twitch');

const getViewerRoutes = require('./routes/v1.1/viewer/get');
const saveConfigRoutes = require('./routes/v1.1/config/save');
const getConfigRoutes = require('./routes/v1.1/config/get');

const db = require('./modules/db');

const { env } = process;

/* Server instance */

const serverOptions = {
  logger: env.NODE_ENV === 'development',
  https: env.API_HOST_PROTOCOL === 'https' ? {
    key: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'ssl', 'server.crt')),
  } : false,
};

const server = fastify(serverOptions);

/* Plugins */

server.register(compression);
server.register(blipp);
server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST'],
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
server.register(rateLimit, { max: 100, timeWindow: '1 minute' });
server.register(sensible);
server.register(auth);
server.register(twitchExt, {
  secret: twitchConfig.sharedSecret,
});

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
    server.error(err);
    process.exit(1);
  }
};

/* Exception handling */

process.on('uncaughtException', (error) => {
  console.error(error); // eslint-disable-line
});
process.on('unhandledRejection', (error) => {
  console.error(error); // eslint-disable-line
});

/* Here we go! */

start();

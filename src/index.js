require('dotenv').config();
const fastify = require('fastify');
const cors = require('fastify-cors');
const rateLimit = require('fastify-rate-limit');
const blipp = require('fastify-blipp');
const healthcheck = require('fastify-healthcheck');
const compression = require('fastify-compress');
const helmet = require('fastify-helmet');
const sensible = require('fastify-sensible');
const noIcon = require('fastify-no-icon');
const tlsKeygen = require('fastify-tls-keygen');
const fastifyCaching = require('fastify-caching');
const fastifyRedis = require('fastify-redis');
const Redis = require('ioredis');
const AbstractCache = require('abstract-cache');
const twitchEbs = require('fastify-twitch-ebs-tools');

const appConfig = require('./config/app');
const dbConfig = require('./config/database');
const twitchConfig = require('./config/twitch');
const redisConfig = require('./config/redis');
const bnetConfig = require('./config/battlenet');

const getViewerRoutes = require('./routes/v1.1/viewer/get');
const saveConfigRoutes = require('./routes/v1.1/config/save');
const getConfigRoutes = require('./routes/v1.1/config/get');

const db = require('./plugins/db');
const sc2pte = require('./plugins/sc2pte');
const snapshot = require('./plugins/snapshot');

const { env } = process;

/* Server instance */

const serverOptions = {
  logger: env.NODE_ENV === 'development',
  https: env.API_HOST_PROTOCOL === 'https',
};

const server = fastify(serverOptions);

/* Caching */

const redisClient = new Redis(redisConfig.connectionString);

const abcache = new AbstractCache({
  useAwait: true,
  driver: {
    name: 'abstract-cache-redis',
    options: {
      client: redisClient,
      cacheSegment: 'sc2pte-cache',
    },
  },
});

server.register(fastifyRedis, { client: redisClient });
server.register(fastifyCaching, {
  cache: abcache,
  expiresIn: 5 * 60, // seconds
  cacheSegment: 'sc2pte',
});

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
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  redis: redisClient,
  whitelist: ['127.0.0.1'],
  skipOnError: true,
});
server.register(sensible);
server.register(twitchEbs, {
  enabled: env.NODE_ENV === 'production',
  secret: twitchConfig.sharedSecret,
});
server.register(noIcon);
server.register(sc2pte);

if (env.API_HOST_PROTOCOL === 'https') {
  server.register(tlsKeygen);
}

/* Data snapshots for dark times in January 2020 when Battle.net API is down */

server.register(snapshot, {
  dataDir: bnetConfig.snapshotDataDirectory,
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
    server.log.error(err);
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

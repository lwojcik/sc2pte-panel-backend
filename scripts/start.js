(process.env.NODE_ENV !== 'production') && require('dotenv').config();
const fastify = require('fastify');
// const fp = require('fastify-plugin');
const fastifyRedis = require('fastify-redis');
const fastifyEnv = require('fastify-env');
const fastifyCors = require('fastify-cors');
const server = require('../dist/index');

const envSchema = {
  type: 'object',
  required: [
    'NODE_ENV',
    'SC2PTE_NODE_HOST',
    'SC2PTE_NODE_PORT',
    'SC2PTE_SAS_URL',
    'SC2PTE_SAS_STATUS_ENDPOINT',
    'SC2PTE_REDIS_ENABLE',
    'SC2PTE_REDIS_HOST',
    'SC2PTE_REDIS_PORT',
    'SC2PTE_REDIS_PASSWORD',
    'SC2PTE_REDIS_DB',
    'SC2PTE_MONGODB_CONNECTION_STRING',
    'SC2PTE_ENABLE_TWITCH_EXT_ONAUTHORIZED',
  ],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
  }
}

const { env } = process;

const opts = {
  app: {
    nodeEnv: env.NODE_ENV || 'development',
    port: env.SC2PTE_NODE_PORT || '8080',
  },
  sas: {
    url: env.SC2PTE_SAS_URL || 'http://localhost:8081',
    statusEndpoint: env.SC2PTE_SAS_STATUS_ENDPOINT || 'status',
  },
  redis: {
    enable: env.SC2PTE_REDIS_ENABLE === 'true' || false,
    host: env.SC2PTE_REDIS_HOST || '127.0.0.1',
    port: env.SC2PTE_REDIS_PORT || '6379',
    password: env.SC2PTE_REDIS_PASSWORD || '',
    db: env.SC2PTE_REDIS_DB || '0',
    cacheSegment: env.SC2PTE_REDIS_CACHE_SEGMENT || 'sc2pte2',
    ttl: env.SC2PTE_REDIS_TTL ||  1000 * 60 * 5, // miliseconds
  },
  db: {
    uri: env.SC2PTE_MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/sc2pte'
  },
  twitch: {
    clientId: env.SC2PTE_TWITCH_EXTENSION_CLIENT_ID || '',
    secret: env.SC2PTE_TWITCH_EXTENSION_CLIENT_SECRET || '',
    enableOnauthorized: env.SC2PTE_ENABLE_TWITCH_EXT_ONAUTHORIZED === 'true' || false,
  },
  maxProfiles: Number(env.SC2PTE_MAXIMUM_PROFILE_COUNT) || 3,
}

const fastifyInstance = fastify({
  logger: process.env.NODE_ENV === 'development'
});

fastifyInstance.register(fastifyEnv, {
  schema: envSchema,
  dotenv: {
      path: `${__dirname}/.env`,
      debug: process.env.NODE_ENV === 'development'
  },
});

if (env.SC2PTE_REDIS_ENABLE === 'true') {
  fastifyInstance.register(fastifyRedis, {
    host: opts.redis.host,
    port: opts.redis.port,
    password: opts.redis.password,
    enableReadyCheck: true,
    dropBufferSupport: false,
  });
}

fastifyInstance.register(fastifyCors, { 
  origin: [ /localhost/, /127.0.0.1/ ],
});

fastifyInstance.register(server, opts);

const start = () => fastifyInstance.listen(env.SC2PTE_NODE_PORT, (err) => {
  if (err) throw new Error(err);
  fastifyInstance.log.info(`Redis cache enabled: ${opts.redis.enable}`);
  fastifyInstance.log.info(`Twitch.ext.onauthorized: ${opts.twitch.enableOnauthorized}`)
});

start();
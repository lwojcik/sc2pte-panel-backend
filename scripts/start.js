(process.env.NODE_ENV !== 'production') && require('dotenv').config();
const fastify = require('fastify');
// const fp = require('fastify-plugin');
const fastifyBlipp = require('fastify-blipp');
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
    'SC2PTE_ENABLE_TWITCH_EXT_ONAUTHORIZED',
  ],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
  }
}

const opts = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.SC2PTE_NODE_PORT || '8081',
  },
  sas: {
    url: process.env.SC2PTE_SAS_URL || 'http://localhost:8082',
    statusEndpoint: process.env.SC2PTE_SAS_STATUS_ENDPOINT || 'status',
  },
  redis: {
    enable: process.env.SC2PTE_REDIS_ENABLE === 'true' || false,
    host: process.env.SC2PTE_REDIS_HOST || '127.0.0.1',
    port: process.env.SC2PTE_REDIS_PORT || '6379',
    password: process.env.SC2PTE_REDIS_PASSWORD || '',
    db: process.env.SC2PTE_REDIS_DB || '0',
    cacheSegment: process.env.SC2PTE_REDIS_CACHE_SEGMENT || 'sc2pte2',
    ttl: process.env.SC2PTE_REDIS_TTL ||  1000 * 60 * 5, // miliseconds
  },
  twitch: {
    clientId: process.env.SC2PTE_TWITCH_EXTENSION_CLIENT_ID || '',
    secret: process.env.SC2PTE_TWITCH_EXTENSION_CLIENT_SECRET || '',
    enableOnauthorized: process.env.SC2PTE_ENABLE_TWITCH_EXT_ONAUTHORIZED === 'true' || false,
  },
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

if (process.env.SC2PTE_REDIS_ENABLE === 'true') {
  fastifyInstance.register(fastifyRedis, {
    host: opts.redis.host,
    port: opts.redis.port,
    password: opts.redis.password,
    enableReadyCheck: true,
    dropBufferSupport: false,
  });
}

fastifyInstance.register(server, opts);
fastifyInstance.register(fastifyBlipp);

fastifyInstance.register(fastifyCors, { 
  origin: [ /localhost/, /127.0.0.1/ ],
})


const start = () => fastifyInstance.listen(process.env.SC2PTE_NODE_PORT, (err) => {
  if (err) throw err;
  fastifyInstance.blipp();
  fastifyInstance.log.info(`Redis cache enabled: ${!!opts.redis.enable}`);
  fastifyInstance.log.info(`Twitch.ext.onauthorized: ${!!opts.twitch.enableOnauthorized}`)
});

start();
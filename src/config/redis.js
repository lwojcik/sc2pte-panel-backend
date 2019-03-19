/**
 * @file    Redis configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2019-03-18
 */

const { env } = process;

const redisConfig = {};
redisConfig.connectionString = env.API_REDIS_CONNECTION_STRING || 'redis://127.0.0.1:6379';
redisConfig.host = env.API_REDIS_HOST || '127.0.0.1';
redisConfig.port = env.API_REDIS_HOST || '6379';
redisConfig.db = env.API_REDIS_DB || '4';
redisConfig.replyCachePeriod = 1000 * 60 * 5;
redisConfig.viewKey = 'view';

module.exports = redisConfig;

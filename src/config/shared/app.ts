/**
 * @file    App configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

const { env } = process;

const appConfig = {};

/** Node.js app port */
appConfig.port = env.API_NODE_PORT || 8881;
/** Node.js app IP */
appConfig.url = env.API_NODE_IP;
/** Node.js app protocol (defaults to https) */
appConfig.protocol = env.API_HOST_PROTOCOL || 'https';
/** Node.js app host */
appConfig.host = env.API_NODE_HOST || 'localhost';
/** Node.js app full URL */
appConfig.siteUrl = `${appConfig.protocol}://${appConfig.host}:${appConfig.port}`;

module.exports = appConfig;

/**
 * @file    App configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

const { env } = process;

interface AppConfig {
  port: string;
  url: string;
  protocol: string;
  host: string;
  siteUrl: string;
}

const appConfig = {} as AppConfig;

/** Node.js app port */
appConfig.port = env.API_NODE_PORT || '8881';
/** Node.js app IP */
appConfig.url = env.API_NODE_IP || '127.0.0.1';
/** Node.js app protocol (defaults to https) */
appConfig.protocol = env.API_HOST_PROTOCOL || 'https';
/** Node.js app host */
appConfig.host = env.API_NODE_HOST || 'localhost';
/** Node.js app full URL */
appConfig.siteUrl = `${appConfig.protocol}://${appConfig.host}:${appConfig.port}`;

export default appConfig;

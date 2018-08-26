/**
 * @file    SSL configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

const sslConfig = {};

/** SSL key file path */
sslConfig.key = './ssl/server.key';
/** SSL certificate file path */
sslConfig.cert = './ssl/server.crt';

module.exports = sslConfig;

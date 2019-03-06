/**
 * @file    SSL configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

import path from 'path';

interface SslConfig {
  key: string;
  cert: string;
}

const sslConfig = {} as SslConfig;

/** SSL key file path */
sslConfig.key = path.join(__dirname, 'ssl', 'server.key');
/** SSL certificate file path */
sslConfig.cert = path.join(__dirname, 'ssl', 'server.crt');

export default sslConfig;

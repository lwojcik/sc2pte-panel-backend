/**
 * @file    Battle.net configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-11-17
 */

const { env } = process;

const bnetConfig = {
  /** Battle.net API key */
  apiKey: env.API_BATTLENET_KEY,
  /** Battle.net API secret */
  apiSecret: env.API_BATTLENET_SECRET,
};

export default bnetConfig;

/**
 * @file    Battle.net configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-11-17
 */

const { env } = process;

const bnetConfig = {};

/** Battle.net API key */
bnetConfig.apiKey = env.API_BATTLENET_KEY;
/** Battle.net API secret */
bnetConfig.apiSecret = env.API_BATTLENET_SECRET;

module.exports = bnetConfig;

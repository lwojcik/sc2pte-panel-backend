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
bnetConfig.apiDisabledJanuary2020 = env.API_BATTLENET_APIS_DISABLED_JANUARY_2020 === 'true';
bnetConfig.snapshotDataDirectory = env.API_SNAPSHOT_DATA_DIRECTORY;

module.exports = bnetConfig;

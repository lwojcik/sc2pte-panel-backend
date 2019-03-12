/**
 * @file    Twitch.tv configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-12
 */

const { env } = process;

const twitchConfig = {};

/** Twitch Extension Client ID */
twitchConfig.clientId = env.API_TWITCH_EXTENSION_CLIENT_ID;
/** Twitch Extension shared secret key */
twitchConfig.sharedSecret = env.API_TWITCH_EXTENSION_SHARED_SECRET;

module.exports = twitchConfig;

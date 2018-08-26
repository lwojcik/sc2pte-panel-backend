/**
 * @file    Twitch.tv configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-12
 */

const { env } = process;


const twitchConfig = {};

/** Twitch Extension shared secret key */
twitchConfig.clientId = env.API_TWITCH_EXTENSION_CLIENT_ID;
/** Twitch Extension Client ID */
twitchConfig.sharedSecret = Buffer.from(env.API_TWITCH_EXTENSION_SHARED_SECRET, 'base64');

module.exports = twitchConfig;

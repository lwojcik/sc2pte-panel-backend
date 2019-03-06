/**
 * @file    Twitch.tv configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-12
 */

const { env } = process;

interface TwitchConfig {
  clientId: string;
  sharedSecret: string;
}

const twitchConfig = {} as TwitchConfig;

/** Twitch Extension Client ID */
twitchConfig.clientId = <string>env.API_TWITCH_EXTENSION_CLIENT_ID;
/** Twitch Extension shared secret key */
twitchConfig.sharedSecret = Buffer.from(env.API_TWITCH_EXTENSION_SHARED_SECRET as string, 'base64').toString();

export default twitchConfig;

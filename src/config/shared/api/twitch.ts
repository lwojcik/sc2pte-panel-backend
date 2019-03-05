/**
 * @file    Twitch.tv configuration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-12
 */

const twitchConfig = {
  /** Twitch Extension Client ID */
  clientId: env.API_TWITCH_EXTENSION_CLIENT_ID as string,
  /** Twitch Extension shared secret key */
  sharedSecret: Buffer.from(env.API_TWITCH_EXTENSION_SHARED_SECRET as string, 'base64').toString(),
};

export default twitchConfig;

/**
 * @file    Twitch-related JWT helper functions
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-21
 */

import * as jwt from 'jsonwebtoken';

import twitchConfig from '../config/shared/api/twitch';

export interface TwitchPayload {
  channel_id: number,
  role: string,
}

const validateTokenPermissions = (payload:TwitchPayload, channelId:number, role:string):boolean => (
  payload.channel_id === channelId
  && payload.role === role
);

const validateToken = (channelId:number, token:string, role:string):boolean => {
  const tokenNotEmpty = token.length > 0;
  const tokenSyntaxLooksCorrect = token.split('.').length === 3;

  if (tokenNotEmpty && tokenSyntaxLooksCorrect) {
    try {
      const payload = jwt.verify(token, twitchConfig.sharedSecret) as TwitchPayload;
      const sufficientPermissions = validateTokenPermissions(payload, channelId, role);
      if (sufficientPermissions) return true;
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

export {
  validateTokenPermissions,
  validateToken,
};
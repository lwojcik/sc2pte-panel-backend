/**
 * @file    Twitch-related JWT helper functions
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-21
 */

const jwt = require('jsonwebtoken');

const twitchConfig = require('../config/api/twitch');

const validateTokenPermissions = (payload, channelId, role) => (
  payload.channel_id === channelId &&
  payload.role === role
);

const validateToken = (channelId, token, role) => {
  const tokenNotEmpty = token.length > 0;
  const tokenSyntaxLooksCorrect = token.split('.').length === 3;

  if (tokenNotEmpty && tokenSyntaxLooksCorrect) {
    try {
      const payload = jwt.verify(token, twitchConfig.sharedSecret);
      const sufficientPermissions = validateTokenPermissions(payload, channelId, role);
      if (sufficientPermissions) return true;
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

module.exports = {
  validateTokenPermissions,
  validateToken,
};

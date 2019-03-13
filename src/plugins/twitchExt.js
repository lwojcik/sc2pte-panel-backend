const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');

function fastifyTwitchExt(fastify, options, next) { // eslint-disable-line consistent-return
  if (!options.secret) {
    return next(new Error('missing secret'));
  }

  const { secret } = options;

  function decodeToken(token) { // eslint-disable-line
    try {
      return jwt.verify(token, Buffer.from(secret, 'base64'));
    } catch (error) {
      return next(new Error('invalid token'));
    }
  }

  async function verifyToken(token) {
    try {
      await jwt.verify(token, Buffer.from(secret, 'base64'));
    } catch (error) {
      next(new Error('invalid token'));
    }
  }

  function verifyChannelId(payload, channelId) {
    return payload.channel_id === channelId;
  }

  function verifyIfTokenExpired(payload) {
    const timeNowInEpochSeconds = Math.round(new Date().getTime() / 1000);
    return payload.exp >= timeNowInEpochSeconds;
  }

  function verifyRole(payload, role) {
    return payload.role === role;
  }

  function verifyChannelIdAndRole(payload, channelId, role) {
    return verifyChannelId(payload, channelId)
      && verifyRole(payload, role);
  }

  function verifyBroadcaster(payload, channelId) {
    return verifyChannelId(payload, channelId)
      && verifyRole(payload, 'broadcaster');
  }

  function verifyViewerOrBroadcaster(payload, channelId) {
    return verifyChannelId(payload, channelId)
      && (verifyRole(payload, 'broadcaster')
        || verifyRole(payload, 'viewer'));
  }

  function validatePermission(token, channelId, role) {
    const payload = decodeToken(token);
    return verifyIfTokenExpired(payload)
      && verifyChannelId(payload, channelId)
      && verifyRole(payload, role);
  }

  fastify.decorate('twitchExt', {
    decodeToken,
    verifyToken,
    verifyIfTokenExpired,
    verifyBroadcaster,
    verifyChannelId,
    verifyRole,
    verifyViewerOrBroadcaster,
    verifyChannelIdAndRole,
    validatePermission,
  });

  next();
}

module.exports = fp(fastifyTwitchExt, {
  fastify: '>=1.0.0',
  name: 'fastify-twitch',
});

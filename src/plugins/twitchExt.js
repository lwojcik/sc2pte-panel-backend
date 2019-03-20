const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');

function fastifyTwitchExt(fastify, options, next) { // eslint-disable-line consistent-return
  if (!options.secret) {
    return next(new Error('missing secret'));
  }

  const { secret } = options;
  const development = options.development || false;

  fastify.log.info(`Twitch token verification: ${development ? 'DISABLED' : 'ENABLED'} (development: ${development})`); // eslint-disable-line

  function decodeToken(token) {
    try {
      return jwt.verify(token, Buffer.from(secret, 'base64'));
    } catch (error) {
      return next(new Error('invalid token'));
    }
  }

  async function verifyToken(token) {
    if (!development) {
      try {
        await jwt.verify(token, Buffer.from(secret, 'base64'));
      } catch (error) {
        next(new Error('invalid token'));
      }
    }
  }

  function verifyChannelId(payload, channelId) {
    if (development) return true;
    return payload.channel_id === channelId;
  }

  function verifyIfTokenIsNotExpired(payload) {
    if (development) return true;
    const timeNowInEpochSeconds = Math.round(new Date().getTime() / 1000);

    if (payload.exp) {
      return timeNowInEpochSeconds <= payload.exp;
    }
    return true;
  }

  function verifyRole(payload, role) {
    if (development) return true;
    return payload.role === role;
  }

  function verifyChannelIdAndRole(payload, channelId, role) {
    if (development) return true;
    return verifyChannelId(payload, channelId)
      && verifyRole(payload, role);
  }

  function verifyBroadcaster(payload, channelId) {
    if (development) return true;
    return verifyChannelId(payload, channelId)
      && verifyRole(payload, 'broadcaster');
  }

  function verifyViewerOrBroadcaster(payload, channelId) {
    if (development) return true;
    return verifyChannelId(payload, channelId)
      && (verifyRole(payload, 'broadcaster')
        || verifyRole(payload, 'viewer'));
  }

  function validatePermission(token, channelId, roles) {
    if (development) return true;
    const payload = decodeToken(token);
    let verifiedRole;

    if (Array.isArray(roles)) {
      verifiedRole = roles.some(role => verifyRole(role));
    } else {
      verifiedRole = verifyRole(roles);
    }

    return verifyIfTokenIsNotExpired(payload)
      && verifyChannelId(payload, channelId)
      && verifiedRole;
  }

  fastify.decorate('twitchExt', {
    decodeToken,
    verifyToken,
    verifyIfTokenIsNotExpired,
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
  fastify: '>=2.0.0',
  name: 'fastify-twitchext',
});

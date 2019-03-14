const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');

function fastifyTwitchExt(fastify, options, next) { // eslint-disable-line consistent-return
  if (!options.secret) {
    return next(new Error('missing secret'));
  }

  const { secret } = options;
  const enabled = options.enabled || true;

  fastify.log.info(`Twitch token verification: ${enabled ? 'ENABLED' : 'DISABLED'}`); // eslint-disable-line

  // fastify.addHook("onRoute", routeOptions => {
  //   routes.push(routeOptions);
  // });

  function decodeToken(token) { // eslint-disable-line
    try {
      return jwt.verify(token, Buffer.from(secret, 'base64'));
    } catch (error) {
      return next(new Error('invalid token'));
    }
  }

  async function verifyToken(token) {
    if (enabled) {
      try {
        await jwt.verify(token, Buffer.from(secret, 'base64'));
      } catch (error) {
        next(new Error('invalid token'));
      }
    }
  }

  function verifyChannelId(payload, channelId) {
    if (!enabled) return true;
    return payload.channel_id === channelId;
  }

  function verifyIfTokenExpired(payload) {
    if (!enabled) return true;
    const timeNowInEpochSeconds = Math.round(new Date().getTime() / 1000);
    return payload.exp >= timeNowInEpochSeconds;
  }

  function verifyRole(payload, role) {
    if (!enabled) return true;
    return payload.role === role;
  }

  function verifyChannelIdAndRole(payload, channelId, role) {
    if (!enabled) return true;
    return verifyChannelId(payload, channelId)
      && verifyRole(payload, role);
  }

  function verifyBroadcaster(payload, channelId) {
    if (!enabled) return true;
    return verifyChannelId(payload, channelId)
      && verifyRole(payload, 'broadcaster');
  }

  function verifyViewerOrBroadcaster(payload, channelId) {
    if (!enabled) return true;
    return verifyChannelId(payload, channelId)
      && (verifyRole(payload, 'broadcaster')
        || verifyRole(payload, 'viewer'));
  }

  function validatePermission(token, channelId, roles) {
    if (!enabled) return true;
    const payload = decodeToken(token);
    let verifiedRole;

    if (Array.isArray(roles)) {
      verifiedRole = roles.some(role => verifyRole(role));
    } else {
      verifiedRole = verifyRole(roles);
    }

    return verifyIfTokenExpired(payload)
      && verifyChannelId(payload, channelId)
      && verifiedRole;
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

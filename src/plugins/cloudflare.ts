import fp from 'fastify-plugin';
import Cloudflare from 'cloudflare';

interface CloudFlareOptions {
  token: string;
  zoneId: string;
  productionDomain: string;
  viewerRoute: string;
}

export default fp(async (server, opts: CloudFlareOptions, next) => {
  const {
    token,
    zoneId,
    productionDomain,
    viewerRoute,
  } = opts;

  if (!token) {
    throw new Error('Missing API token');
  }

  if (!zoneId) {
    throw new Error('Missing zone id');
  }

  const cf = new Cloudflare({ token });

  const purgeByChannelId = async (channelId: string) => {
    const status = cf.zones.purgeCache(zoneId, {
      files: [
        `https://${productionDomain}/${viewerRoute}/${channelId}`,
      ],
    });
    return status;
  };

  server.decorate('cloudflare', {
    purgeByChannelId,
  });

  next();
});

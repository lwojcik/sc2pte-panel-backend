import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import http from 'http';
import { PlayerObject } from '../@types/fastify';

export interface SasOptions {
  url: String;
  statusEndpoint: String;
}

interface OKReply {
  status: 200;
  message: 'ok';
  timestamp: string;
}

const sas = fp(
  async (
    fastify: FastifyInstance,
    opts: SasOptions,
    next: Function,
  ) => {
    const { url, statusEndpoint } = opts;
    const statusUrl = `${url}/${statusEndpoint}`;

    const get = (url: string): object =>
      new Promise((resolve, reject) => {
        http
          .get(url, (res) => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', chunk => (body += chunk));
            res.on('end', () => resolve(JSON.parse(body)));
          })
          .on('error', reject);
      });

    const checkIfHostIsUp = async (url: string) => {
      try {
        const response = await get(url) as OKReply;
        if (response.status && response.status !== 200) return false;
        return true;
      } catch (error) {
        return false;
      }
    };

    const getFromApi = (endpoint: string) => get(`${url}${endpoint}`);

    const checkOnStartup = async () => {
      const isSASup = await checkIfHostIsUp(statusUrl);
      isSASup
        ? fastify.log.info('sc2-api-service status: running')
        : fastify.log.info('sc2-api-service status: down or starting');
    };

    const getProfile = ({ regionId, realmId, profileId }: PlayerObject) =>
      getFromApi(`/profile/profile/${regionId}/${realmId}/${profileId}`);

    const getLadderSummary = ({ regionId, realmId, profileId }: PlayerObject) =>
      getFromApi(`/profile/ladderSummary/${regionId}/${realmId}/${profileId}`);

    const getLegacyMatchHistory = ({ regionId, realmId, profileId }: PlayerObject) =>
      getFromApi(`/legacy/matches/${regionId}/${realmId}/${profileId}`);

    const getLadder = (
      {
        regionId,
        realmId,
        profileId,
      }: PlayerObject,
      ladderId: string | number,
    ) =>
      getFromApi(`/profile/ladder/${regionId}/${realmId}/${profileId}/${ladderId}`);

    fastify.decorate('sas', {
      getProfile,
      getLadderSummary,
      getLegacyMatchHistory,
      getLadder,
    });

    checkOnStartup();

    next();
  },
);

export default sas;

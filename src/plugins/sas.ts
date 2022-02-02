import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import http from "http";
import { PlayerObject } from "starcraft2-api";

export interface SasOptions {
  url: string;
  statusEndpoint: string;
}

interface OKReply {
  status: 200;
  message: "ok";
  timestamp: string;
}

const sasPlugin: FastifyPluginCallback<SasOptions> = (fastify, opts, next) => {
  const { url, statusEndpoint } = opts;
  const statusUrl = `${url}/${statusEndpoint}`;

  const get = (urlToGet: string) =>
    new Promise((resolve, reject) => {
      http
        .get(urlToGet, (res) => {
          res.setEncoding("utf8");
          let body = "";
          // eslint-disable-next-line no-return-assign
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(JSON.parse(body)));
        })
        .on("error", reject);
    });

  const checkIfHostIsUp = async (urlToCheck: string) => {
    try {
      const response = (await get(urlToCheck)) as OKReply;
      if (response.status && response.status !== 200) return false;
      return true;
    } catch (error) {
      return false;
    }
  };

  const getFromApi = (endpoint: string) => get(`${url}${endpoint}`);

  const checkOnStartup = async () => {
    const isSASup = await checkIfHostIsUp(statusUrl);
    if (isSASup) {
      fastify.log.info("sc2-api-service status: running");
    } else {
      fastify.log.info("sc2-api-service status: down or starting");
    }
  };

  const getProfile = ({ regionId, realmId, profileId }: PlayerObject) =>
    getFromApi(`/profile/profile/${regionId}/${realmId}/${profileId}`);

  const getLadderSummary = ({ regionId, realmId, profileId }: PlayerObject) =>
    getFromApi(`/profile/ladderSummary/${regionId}/${realmId}/${profileId}`);

  const getLegacyMatchHistory = ({
    regionId,
    realmId,
    profileId,
  }: PlayerObject) =>
    getFromApi(`/legacy/matches/${regionId}/${realmId}/${profileId}`);

  const getLadder = (
    { regionId, realmId, profileId }: PlayerObject,
    ladderId: string | number
  ) =>
    getFromApi(
      `/profile/ladder/${regionId}/${realmId}/${profileId}/${ladderId}`
    );

  fastify.decorate("sas", {
    getProfile,
    getLadderSummary,
    getLegacyMatchHistory,
    getLadder,
  });

  checkOnStartup();

  next();
};

export default fp(sasPlugin);

import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import http from "http";
import { PlayerObject } from "starcraft2-api";

export interface SasOptions {
  url: string;
  statusEndpoint: string;
}

const sasPlugin: FastifyPluginCallback<SasOptions> = (fastify, opts, next) => {
  const { url } = opts;

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

  const getFromApi = (endpoint: string) => get(`${url}${endpoint}`);

  const getProfile = ({ regionId, realmId, profileId }: PlayerObject) =>
    getFromApi(`/profile/profile/${regionId}/${realmId}/${profileId}`);

  const getLadderSummary = ({ regionId, realmId, profileId }: PlayerObject) =>
    getFromApi(`/profile/laddersummary/${regionId}/${realmId}/${profileId}`);

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

  next();
};

export default fp(sasPlugin);

import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { StarCraft2API, PlayerObject } from "starcraft2-api";
import { ConfigObject } from "../@types/fastify.d";

interface PlayerConfigPluginOptions {
  maxProfiles: number;
}

const playerConfigPlugin: FastifyPluginCallback<PlayerConfigPluginOptions> = (
  server,
  opts: PlayerConfigPluginOptions,
  next
) => {
  const { maxProfiles } = opts;

  const isChannelIdValid = (channelId: string) =>
    channelId === Number(channelId).toString();

  const minimumOneElement = (dataArray: PlayerObject[]) =>
    Array.isArray(dataArray) && dataArray.length > 0;

  const maximumElementCount = (dataArray: PlayerObject[]) =>
    Array.isArray(dataArray) && dataArray.length <= maxProfiles;

  const isPlayerObjectValid = (playerObject: PlayerObject) => {
    try {
      const { regionId, realmId, profileId } = playerObject;

      const profileIdValid =
        profileId > 0 &&
        profileId.toString() === parseInt(profileId as string, 10).toString();

      return (
        StarCraft2API.validateRegionId(regionId) &&
        StarCraft2API.validateSc2Realm(realmId) &&
        profileIdValid
      );
    } catch (error) {
      return false;
    }
  };

  const allElementsValid = (playerObjects: PlayerObject[]) =>
    playerObjects.map((playerObject) => isPlayerObjectValid(playerObject));

  const isDataValid = (data: PlayerObject[]) =>
    minimumOneElement(data) &&
    maximumElementCount(data) &&
    allElementsValid(data);

  const saveToDb = (config: ConfigObject) => server.db.save(config);

  const validate = ({ channelId, data }: ConfigObject) =>
    isChannelIdValid(channelId) && isDataValid(data);

  const save = (config: ConfigObject) => {
    if (validate(config)) {
      saveToDb(config);
      return true;
    }
    return false;
  };

  const get = (channelId: number) => server.db.get(channelId);

  server.decorate("playerConfig", { save, get });

  next();
};

export default fp(playerConfigPlugin);

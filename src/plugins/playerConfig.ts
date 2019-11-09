import fp from 'fastify-plugin';
import { ConfigObject, PlayerObject } from '../@types/fastify';
import StarCraft2API from 'starcraft2-api';

interface PlayerConfigPluginOptions {
  maxPlayerProfileCount: number;
}

export default fp(async (server, opts: PlayerConfigPluginOptions, next) => {
  const maxCount = opts.maxPlayerProfileCount;

  const isChannelIdValid = (channelId: string) =>
    channelId === Number(channelId).toString();
  
  const minimumOneElement = (dataArray: PlayerObject[]) =>
    Array.isArray(dataArray) && dataArray.length > 0;
  
  const maximumElementCount = (dataArray: PlayerObject[]) =>
    Array.isArray(dataArray) && dataArray.length <= maxCount;
  
  const isPlayerObjectValid = (playerObject: PlayerObject) => {
    try {
      const { regionId, realmId, profileId } = playerObject;

      return StarCraft2API.validateRegionId(regionId)
        && StarCraft2API.validateSc2Realm(realmId)
        && StarCraft2API.validateProfileId(profileId);
    } catch (error) {
      return false;
    }
  }
  
  const allElementsValid = (playerObjects: PlayerObject[]) => 
    playerObjects.map(playerObject => isPlayerObjectValid(playerObject));
  
  const isDataValid = (data: PlayerObject[]) => 
    minimumOneElement(data)
      && maximumElementCount(data)
      && allElementsValid(data);

  const saveToDb = (config: ConfigObject) =>
    server.db.save(config);

  const validate = ({ channelId, data }: ConfigObject) =>
    isChannelIdValid(channelId) && isDataValid(data);

  const save = (config: ConfigObject) => {
    if (validate(config)) {
      saveToDb(config);
      server.cache.purge(config.channelId);
      return true;
    }
    return false;
  }

  const get = (channelId: number) =>
    server.db.get(channelId);

  server.decorate('playerConfig', { save, get });

  next();
});
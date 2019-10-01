import { ConfigObject, PlayerObject } from '../../@types/fastify';
import StarCraft2API from 'starcraft2-api';

const maxPlayerObjectCount = process.env.SC2PTE_MAXIMUM_PLAYER_OBJECT_COUNT!;

const isChannelIdValid = (channelId: string) =>
  channelId === parseInt(channelId, 10).toString();

const minimum1Element = (dataArray: PlayerObject[]) =>
  Array.isArray(dataArray) && dataArray.length > 0;

const maximumElementCount = (dataArray: PlayerObject[]) => {
  const maxCount = parseInt(maxPlayerObjectCount, 10) || 5;
  return Array.isArray(dataArray) && dataArray.length <= maxCount;
}

const isPlayerObjectValid = (playerObject: PlayerObject) => {
  try {
    return playerObject.regionId
    && playerObject.realmId
    && playerObject.profileId
    && StarCraft2API.validateRegionId(playerObject.regionId)
    && StarCraft2API.validateSc2Realm(playerObject.realmId)
    && StarCraft2API.validateProfileId(playerObject.profileId);
  } catch (error) {
    return false;
  }
}

const allElementsValid = (playerObjects: PlayerObject[]) => 
playerObjects.map(playerObject => isPlayerObjectValid(playerObject));

const isDataValid = (data: PlayerObject[]) => 
  minimum1Element(data)
  && maximumElementCount(data)
  && allElementsValid(data);

const validateConfig = ({ channelId, data }: ConfigObject) =>
  isChannelIdValid(channelId) && isDataValid(data);

export default validateConfig;
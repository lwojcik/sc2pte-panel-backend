import { ConfigObject, PlayerObject } from '../../@types/fastify';
import StarCraft2API from 'starcraft2-api';

const maxPlayerObjectCount = parseInt(process.env.SC2PTE_MAXIMUM_PLAYER_OBJECT_COUNT!, 10);

const isChannelIdValid = (channelId: string) =>
  channelId === parseInt(channelId, 10).toString();

const minimum1Element = (dataArray: PlayerObject[]) =>
  Array.isArray(dataArray) && dataArray.length > 0;

const maximumElementCount = (dataArray: PlayerObject[], count: number) => {
  const maxCount = count || 5;
  return Array.isArray(dataArray) && dataArray.length <= maxCount;
}

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
  minimum1Element(data)
  && maximumElementCount(data, maxPlayerObjectCount)
  && allElementsValid(data);

const validateConfig = ({ channelId, data }: ConfigObject) =>
  isChannelIdValid(channelId) && isDataValid(data);

export default validateConfig;
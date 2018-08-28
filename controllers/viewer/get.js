const { validateToken } = require('../../helpers/jwt');
const { getChannelConfigFromDb } = require('../config/get');

const { getHeaderData } = require('../../helpers/starcraft2/header/index');
const { getLadderData } = require('../../helpers/starcraft2/ladder/index');

const getSC2Data = async (playerConfig) => {
  try {
    const headerData = await getHeaderData(playerConfig);
    const ladderData = await getLadderData(playerConfig);

    const sc2data = Promise.all([headerData, ladderData]);

    return sc2data;
  } catch (err) {
    return {
      status: 500,
      message: 'Error getting StarCraft II data',
    };
  }
};

const getViewerData = async (channelId, token) => {
  try {
    if (channelId && token) {
      const isTokenValid = validateToken(channelId, token, 'viewer');

      if (isTokenValid) {
        const channelConfig = await getChannelConfigFromDb(channelId);

        if (channelConfig) {
          const playerConfig = {
            server: channelConfig.server,
            id: channelConfig.playerid,
            region: channelConfig.region,
            name: channelConfig.name,
          };

          const viewerData = await getSC2Data(playerConfig);
          const playerData = viewerData[0];
          const ladderData = viewerData[1];

          return {
            status: 200,
            ...playerData,
            ...ladderData,
          };
        }
        return {
          status: 404,
          message: 'Account not found',
        };
      }
      return {
        status: 400,
        message: 'Bad request',
      };
    }
    return {
      status: 400,
      message: 'Bad request',
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Error while getting config',
    };
  }
};

module.exports = getViewerData;

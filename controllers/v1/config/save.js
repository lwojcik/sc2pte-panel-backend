const ChannelConfig = require('../../../models/v1/ChannelConfigLegacyModel');
const SC2PlayerApi = require('../../../api/v1/starcraft2/player');

const { validateToken } = require('../../../helpers/shared/jwt');

const checkIfConfigIsComplete = (configObject) => {
  const {
    server,
    playerid,
    region,
    name,
  } = configObject;

  return (
    server.length !== 0
    && playerid.length !== 0
    && region.length !== 0
    && name.length !== 0
  );
};

const validateConfig = async (configObject) => {
  const isConfigComplete = checkIfConfigIsComplete(configObject);

  if (isConfigComplete) {
    try {
      const {
        server,
        playerid,
        region,
        name,
      } = configObject;

      const configToValidate = {
        server,
        id: playerid,
        region,
        name,
      };

      const apiPlayerConfig = await SC2PlayerApi.getPlayerProfile(configToValidate);

      if (apiPlayerConfig.error) return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
};

const saveConfigObjectInDatabase = configObject => new Promise((resolve, reject) => {
  ChannelConfig.findOneAndUpdate(
    {
      channelId: configObject.channelId,
    },
    configObject,
    {
      upsert: true,
      runValidators: true,
    },
    (error, document) => {
      if (error) {
        reject(error);
      } else {
        resolve(document);
      }
    },
  );
});

const saveConfig = async (configObject) => {
  try {
    const {
      channelId,
      server,
      playerid,
      region,
      name,
      token,
    } = configObject;

    const playerConfig = {
      channelId,
      server,
      playerid,
      region,
      name,
    };

    const isConfigValid = await validateConfig(playerConfig);
    const isTokenValid = validateToken(channelId, token, 'broadcaster');

    if (isTokenValid && isConfigValid) {
      const configSaved = await saveConfigObjectInDatabase(playerConfig);
      if (configSaved._id) { // eslint-disable-line no-underscore-dangle
        return {
          status: 201,
          message: 'Player config updated successfully',
        };
      }
      return {
        status: 500,
        message: 'Error while saving config (save)',
      };
    }
    return {
      status: 400,
      message: 'Bad request',
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Error while saving config',
    };
  }
};

module.exports = saveConfig;

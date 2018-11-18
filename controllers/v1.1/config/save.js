const ChannelConfig = require('../../../models/v1.1/ChannelConfigModel');
const SC2PlayerApi = require('../../../api/v1.1/starcraft2/player');

const { validateToken } = require('../../../helpers/shared/jwt');

const checkIfConfigIsComplete = (configObject) => {
  const {
    regionId,
    realmId,
    playerId,
  } = configObject;

  return (
    regionId.length !== 0
    && realmId.length !== 0
    && playerId.length !== 0
  );
};

const validateConfig = async (configObject) => {
  const isConfigComplete = checkIfConfigIsComplete(configObject);

  if (isConfigComplete) {
    try {
      const {
        regionId,
        realmId,
        playerId,
      } = configObject;

      const configToValidate = {
        regionId,
        realmId,
        playerId,
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
      regionId,
      realmId,
      playerId,
      token,
    } = configObject;

    const playerConfig = {
      channelId,
      regionId,
      realmId,
      playerId,
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
        message: 'Error while saving config. Config or token invalid.',
      };
    }
    return {
      status: 400,
      message: 'Bad request',
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Error while saving config. Something went terribly wrong.',
    };
  }
};

module.exports = saveConfig;

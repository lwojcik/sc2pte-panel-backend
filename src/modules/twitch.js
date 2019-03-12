/**
 * @file    Twitch-related helper functions
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2019-03-12
 */

interface ConfigObject {
  regionId: number | string,
  realmId: number | string,
  playerId: number | string,
  selectedView: string | string,
}

const checkIfConfigIsComplete = (configObject:ConfigObject) => {
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
      const savedConfig = await saveConfigObjectInDatabase(configObject);
      if (savedConfig._id) { // eslint-disable-line no-underscore-dangle
        return {
          status: 201,
          message: 'Player config updated successfully',
        };
      }
      return {
        status: 500,
        message: 'Error while saving config. Config or token invalid.',
      };
  } catch (error) {
    return {
      status: 500,
      message: 'Error while saving config. Something went terribly wrong.',
    };
  }
};

export default saveConfig;
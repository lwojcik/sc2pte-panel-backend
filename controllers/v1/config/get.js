const ChannelConfig = require('../../../models/v1/ChannelConfigModel');

const { validateToken } = require('../../../helpers/shared/jwt');

const validateChannelId = channelId => channelId.length > 0;

const getChannelConfigFromDb = async (channelId) => {
  try {
    const channelConfig = await ChannelConfig.findOne({ channelId });
    return channelConfig;
  } catch (error) {
    return {
      status: 500,
      message: 'Error while getting config',
    };
  }
};

const getConfig = async (channelId, token) => {
  try {
    const channelIdIsValid = validateChannelId(channelId);
    const tokenIsValid = validateToken(channelId, token, 'broadcaster');

    if (channelIdIsValid && tokenIsValid) {
      const channelConfig = await getChannelConfigFromDb(channelId);

      if (channelConfig) {
        return {
          status: 200,
          message: 'Config found',
          ...channelConfig._doc, // eslint-disable-line
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
  } catch (error) {
    return {
      status: 400,
      message: 'Bad request',
    };
  }
};

module.exports = {
  getChannelConfigFromDb,
  getConfig,
};

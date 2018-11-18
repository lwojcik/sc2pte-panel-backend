const sc2playerApi = require('../../../../api/v1/starcraft2/player');

const getLadderData = async (player) => {
  try {
    const ladderData = await sc2playerApi.getPlayerAllLaddersSummary(player);
    return {
      ladders: ladderData,
    };
  } catch (error) {
    return error;
  }
};

module.exports = {
  getLadderData,
};

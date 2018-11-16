const sc2playerApi = require('../../../api/starcraft2/player');

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

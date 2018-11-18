const sc2playerApi = require('../../../../api/v1.1/starcraft2/player');
const sc2Config = require('../../../../config/v1.1/api/starcraft2');

const determineHighestRank = (soloRank, teamRank) => {
  const soloRankId = sc2Config.matchMaking.ranks.indexOf(soloRank);
  const teamRankId = sc2Config.matchMaking.ranks.indexOf(teamRank);
  const highestRankId = soloRankId >= teamRankId ? soloRankId : teamRankId;
  return sc2Config.matchMaking.ranks[highestRankId];
};

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
  determineHighestRank,
  getLadderData,
};

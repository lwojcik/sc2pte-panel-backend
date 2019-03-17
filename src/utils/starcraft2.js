const sc2Config = require('../config/starcraft2');

const determineHighestRank = (soloRank, teamRank) => {
  const soloRankId = sc2Config.matchMaking.ranks.indexOf(soloRank);
  const teamRankId = sc2Config.matchMaking.ranks.indexOf(teamRank);
  const highestRankId = soloRankId >= teamRankId ? soloRankId : teamRankId;
  return sc2Config.matchMaking.ranks[highestRankId];
};

module.exports = {
  determineHighestRank,
};

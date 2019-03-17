const StarCraft2API = require('starcraft2-api');
const sc2Config = require('../config/starcraft2');

const determineHighestRank = (soloRank, teamRank) => {
  const soloRankId = sc2Config.matchMaking.ranks.indexOf(soloRank);
  const teamRankId = sc2Config.matchMaking.ranks.indexOf(teamRank);
  const highestRankId = soloRankId >= teamRankId ? soloRankId : teamRankId;
  return sc2Config.matchMaking.ranks[highestRankId];
};

/**
 * Fetches StarCraft 2 ladder data available with Battle.net API key. No MMR info is returned here.
 * @function
 * @param {string} server - Server name abbreviation.
 * @param {string} player - Player object including region id, realm id and player id.
 * @param {number} ladderId - Ladder identifier.
 * @returns {Promise} Promise object representing ladder data.
 */
const getLadderData = async (player, ladderId) => {
  const { regionId, realmId, playerId } = player;

  const requestUri = `/sc2/profile/${regionId}/${realmId}/${playerId}/ladder/${ladderId}`;

  try {
    const ladderData = await bnetApi.queryWithAccessToken(regionId, requestUri);
    return ladderData;
  } catch (error) {
    return {
      error: `Error requesting data from ladder ${ladderId} in region ${regionId}`,
    };
  }
};

// const getPlayerLadderData = (regionId, real)

module.exports = {
  determineHighestRank,
  getLadderData,
};

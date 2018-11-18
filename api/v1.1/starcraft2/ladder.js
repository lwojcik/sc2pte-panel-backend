/**
 * @file    StarCraft 2 ladder data retrieval functions.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-10
 */

const bnetConfig = require('../../../config/v1.1/api/battlenet');
const bnetApi = require('../../../api/v1.1/battlenet');

const { determineRegionNameById } = require('../../../helpers/v1.1/battlenet');

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
  const regionName = determineRegionNameById(regionId);

  if (!bnetConfig.servers.includes(regionName)) {
    return {
      error: `${regionId} is not a valid region id`,
    };
  }

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

module.exports = {
  getLadderData,
};

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
 * @param {number} ladderId - Ladder identifier.
 * @returns {Promise} Promise object representing ladder data.
 */
const getLadderData = async (regionId, ladderId) => {
  const regionName = determineRegionNameById(regionId);
  if (!bnetConfig.servers.includes(regionName)) {
    return {
      error: `${regionId} is not a valid region id`,
    };
  }

  const requestServer = bnetConfig.api.url[regionName];
  const requestUri = `${requestServer}/sc2/ladder/${ladderId}`;

  const ladderData = await bnetApi.queryWithAccessToken(regionId, requestUri);
  return ladderData;
};

module.exports = {
  getLadderData,
};

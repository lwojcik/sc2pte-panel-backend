/**
 * @file    StarCraft 2 ladder data retrieval functions.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-10
 */

const bnetConfig = require('../../config/api/battlenet');
const bnetApi = require('../../api/battlenet');

/**
 * Fetches StarCraft 2 ladder data available with Battle.net API key. No MMR info is returned here.
 * @function
 * @param {string} server - Server name abbreviation.
 * @param {number} ladderId - Ladder identifier.
 * @returns {Promise} Promise object representing ladder data.
 */
const getLadderData = async (server, ladderId) => {
  if (!bnetConfig.servers.includes(server)) {
    return {
      error: `Wrong server (you provided: ${server}, available choices: ${bnetConfig.servers.join(', ')})`,
    };
  }

  const requestServer = bnetConfig.api.url[server];
  const requestUri = `${requestServer}/sc2/ladder/${ladderId}`;

  const ladderData = await bnetApi.query(requestUri);
  return ladderData;
};

/**
 * Fetches StarCraft 2 ladder data (including player MMR) with Battle.net access token.
 * @function
 * @param {string} server - Server name abbreviation..
 * @param {number} ladderId - Ladder identifier.
 * @returns {Promise} Promise object representing ladder data from an authenticated endpoint.
 */
const getAuthenticatedLadderData = async (server, ladderId) => {
  if (!bnetConfig.servers.includes(server)) {
    return {
      error: `Wrong server (you provided: ${server}, available choices: ${bnetConfig.servers.join(', ')})`,
    };
  }

  const requestUri = `/data/sc2/ladder/${ladderId}`;
  const ladderData = await bnetApi.queryWithAccessToken(server, requestUri);

  return ladderData;
};

module.exports = {
  getLadderData,
  getAuthenticatedLadderData,
};

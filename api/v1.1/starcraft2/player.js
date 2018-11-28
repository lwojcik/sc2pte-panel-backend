/**
 * @file    StarCraft 2 player data retrieval functions.
 *
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-08-10
 */

// const logging = require('../../../config/shared/logging');

const sc2Config = require('../../../config/v1.1/api/starcraft2');
const bnetApi = require('../../../api/v1.1/battlenet');
const ladderApi = require('./ladder');
const { determineRankIdByName } = require('../../../helpers/v1.1/battlenet');

/**
 * General method for fetching StarCraft II player data available with Battle.net API key.
 * @function
 * @param {string} resource - Name of the Battle.net API resource to fetch.
 * @param {Object} player - Player object including region id, realm id and player id.
 * @returns {Object} Player data object.
 */
const getSc2PlayerData = async (resource, player) => {
  // logging.info(`getSc2PlayerData(${JSON.stringify(resource)}, ${JSON.stringify(player)})`);
  try {
    const {
      regionId,
      realmId,
      playerId,
    } = player;

    const requestedResource = (resource === 'profile') ? '' : resource;
    const requestPath = `/sc2/profile/${regionId}/${realmId}/${playerId}${requestedResource}`;
    const accessKey = bnetApi.getAccessTokenObjectFromLocalDb();
    const playerData = await bnetApi.queryWithAccessToken(regionId, requestPath, accessKey);
    if (playerData.status === 'nok') {
      return {
        error: 'battlenet_api_error',
      };
    }

    return playerData;
  } catch (error) {
    return error;
  }
};

/**
 * Fetches StarCraft 2 player profile.
 * @function
 * @param {Object} player - Player object including region id, realm id and player id.
 * @returns {Object} Player profile object.
 */
const getPlayerProfile = player => getSc2PlayerData('profile', player);

/**
 * Filters ladder data based on matchmaking mode.
 * @function
 * @param {string} mode - Player matchmaking mode (1v1, archon, 2v2, 3v3 or 4v4).
 * @param {Object} ladderData - Ladder data object returned by Blizzard API.
 * @returns {Object} Ladders filtered by provided mode.
 */
const filterLaddersByMode = async (ladderData, mode) => {
  const laddersToBeReturned = mode.toUpperCase();

  if (!sc2Config.matchMaking.modes.includes(laddersToBeReturned)) {
    return {
      error: `Wrong mode parameter (you provided: ${laddersToBeReturned}, available choices: ${sc2Config.matchMaking.modes.join(', ')})`,
    };
  }

  try {
    const filteredLadders = [];

    if (ladderData.error) return ladderData;
    ladderData.forEach((ladderObject) => {
      if (laddersToBeReturned === 'ALL') {
        filteredLadders.push(ladderObject);
      } else if (
        ladderObject
        && ladderObject.team
        && ladderObject.team.localizedGameMode
        && ladderObject.team.localizedGameMode.toUpperCase() === laddersToBeReturned) {
        filteredLadders.push(ladderObject);
      }
    });
    return filteredLadders.filter(Boolean);
  } catch (error) {
    return error;
  }
};

/**
 * Returns top player ladder by choosing one with the highest MMR.
 * @function
 * @param {object} ladderData - Ladder data object returned by Blizzard API.
 * @returns {object} Object representing top ladder by MMR.
 */
const selectTopLadder = (ladderObjects) => {
  const ladders = ladderObjects.map(ladderObject => ladderObject.data);
  return ladders.sort((a, b) => a.rating - b.rating)[ladders.length - 1];
};

/**
 * Fetches StarCraft 2 player ladders data.
 * @function
 * @param {string} mode - Player matchmaking mode (e.g. 1v1).
 * @param {Object} player - Player object including region id, realm id and player id.
 * @returns {Object} Player ladders object.
 */
const getPlayerLadders = async (mode, player) => {
  try {
    const ladders = await getSc2PlayerData('/ladder/summary', player);
    const filteredLadders = await filterLaddersByMode(ladders, mode);
    return filteredLadders;
  } catch (error) {
    return error;
  }
};

/**
 * Fetches StarCraft 2 player match history.
 * @function
 * @param {Object} player - Player object including region id, realm id and player id.
 * @returns {Object} Player matches object.
 */
const getPlayerMatches = player => getSc2PlayerData('matches', player);

/**
 * Extracts StarCraft 2 player data from ladder object.
 * @function
 * @param {Array} ladderData - Array of player ladder objects.
 * @returns {Array} Array of player objects fetched from provided ladders.
 */
const extractLadderIds = ladderData => ladderData.map(ladder => ladder.ladderId);

/**
 * Fetches StarCraft 2 ladder data by provided id parameter.
 * @function
 * @param {String} server - Battle.net server to fetch the data from.
 * @param {Number} ladderId - ID of the ladder to fetch.
 * @returns {Object} Ladder data object.
 */
const getLadderObjectById = async (player, ladderId) => {
  try {
    const authenticatedLadderData = await ladderApi.getLadderData(
      player,
      ladderId,
    );
    return {
      ladderId,
      league: authenticatedLadderData.league,
      data: authenticatedLadderData,
    };
  } catch (error) {
    return error;
  }
};

/**
 * Extracts array of ladder objects based on provided array of ladder ids.
 * @function
 * @param {String} regionId - Battle.net server to fetch the data from.
 * @param {string} ladderIds - array of ladder IDs.
 * @returns {Promise} Promise object representing ladder objects.
 */
const extractLadderObjectsByIds = (player, ladderIds) => {
  const ladderObjects = ladderIds.map(ladderId => getLadderObjectById(
    player,
    ladderId,
  ));

  return Promise.all(ladderObjects)
    .then(results => results)
    .catch(error => error);
};

/**
 * Extracts player data by their ID from provided ladder objects array.
 * @function
 * @param {String} ladderObjects - array of ladder objects.
 * @param {string} playerId - player ID.
 * @returns {Object} Array of player data objects.
 */
const extractPlayerObjectsFromLadders = (ladderObjects, playerId) => {
  const extractedPlayerObjects = [];

  ladderObjects.forEach((ladderObject) => {
    const ladderData = ladderObject.data.ladderTeams;
    ladderData.forEach((playerDataObject) => {
      const memberList = playerDataObject.teamMembers;

      memberList.forEach((member) => {
        if (Number(member.id) === Number(playerId)) {
          extractedPlayerObjects.push({
            ladderId: ladderObject.ladderId,
            league: ladderObject.league,
            data: playerDataObject,
          });
        }
      });
    });
  });
  return extractedPlayerObjects;
};

/**
 * Filters an array of player ladder objects based on provided filter.
 * @function
 * @param {Array} playerObjects - Player ladder objects.
 * @param {string} filter - Filter to use ('ALL' for all ladders or 'TOP' for a single top ladder).
 * @returns {Array|Object} Array of all ladder objects or single top ladder object.
 */
const filterPlayerObjectsByFilterType = (playerObjects, filter) => {
  const filterType = filter.toUpperCase();
  switch (filterType) {
    case 'ALL':
      return playerObjects;
    case 'TOP':
      return selectTopLadder(playerObjects);
    default:
      return {
        error: 'Wrong filter type provided (expected \'all\', \'top\' or \'sum\')',
      };
  }
};

/**
 * Removes duplicates from ladder ids array in case player
 * has more than one profile in a single division.
 * @function
 * @param {Array} playerObjects - Player ladder objects.
 * @param {string} filter - Filter to use ('ALL' for all ladders, 'TOP' for a single top ladder or
 * 'TOP' for ladder summary).
 * @returns {Array} Array of unique ladder ids.
 */
const dedupeLadderIds = ladderIds => Array.from(new Set(ladderIds));

const prepareSingleLadderSummary = (playerData) => {
  const ladderSummaryObject = {
    totalLadders: 0,
    topRankId: -1,
    topRank: '',
    topMMR: 0,
    wins: 0,
    losses: 0,
    // ties: 0,
  };

  // ugh
  playerData.forEach((ladderObject) => {
    ladderSummaryObject.totalLadders += 1;
    ladderSummaryObject.topRankId = determineRankIdByName(ladderObject.league)
      > ladderSummaryObject.topRankId
      ? determineRankIdByName(ladderObject.league)
      : ladderSummaryObject.topRankId;

    ladderSummaryObject.topRank = sc2Config.matchMaking.ranks[ladderSummaryObject.topRankId];
    ladderSummaryObject.topMMR = ladderObject.data.mmr > ladderSummaryObject.topMMR
      ? ladderObject.data.mmr
      : ladderSummaryObject.topMMR;
    ladderSummaryObject.wins += ladderObject.data.wins;

    ladderSummaryObject.losses += ladderObject.data.losses;
    // ladderSummaryObject.ties += ladderObject.data.ties;
  });
  return ladderSummaryObject;
};

/**
 * Fetches StarCraft 2 player ladder data including MMR.
 * @function
 * @param {string} mode - Player matchmaking mode (e.g. 1v1).
 * @param {string} filter - How much data should be returned ('ALL' - all, 'TOP' - top ladder,
 * 'SUM' - summary).
 * @param {Object} player - Player object including region id, realm id and player id.
 * @returns {Object} Player ladder data including MMR.
 */
const getPlayerMMR = async (mode, filter, player) => {
  try {
    const { playerId } = player;
    const playerLadders = await getSc2PlayerData('/ladder/summary', player);
    const extractedPlayerLadderObjects = await playerLadders.showCaseEntries;
    const filteredPlayerLadders = await filterLaddersByMode(extractedPlayerLadderObjects, mode);

    const filteredLadderIds = await extractLadderIds(filteredPlayerLadders);
    const uniqueFilteredLadderIds = await dedupeLadderIds(filteredLadderIds);
    const extractedLadderObjects = await extractLadderObjectsByIds(player, uniqueFilteredLadderIds);
    const extractedPlayerData = await extractPlayerObjectsFromLadders(
      extractedLadderObjects,
      playerId,
    );

    const data = (filter.toUpperCase() === 'SUM')
      ? await prepareSingleLadderSummary(extractedPlayerData)
      : await filterPlayerObjectsByFilterType(extractedPlayerData, filter);
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Returns the summary of player ladders.
 * @function
 * @param {string} mode - Player matchmaking mode (e.g. 1v1).
 * @param {Object} player - Player object including region id, realm id and player id.
 * @returns {Promise} Promise object representing player data including MMR.
 */
const getPlayerAllLaddersSummary = async (player) => { // eslint-disable-line arrow-body-style
  // TODO: optimize this garbage so that it doesn't request the same data 5 times
  // logging.info(`getPlayerAllLaddersSummary(${player})`);
  return {
    '1v1': await getPlayerMMR('1v1', 'SUM', player),
    archon: await getPlayerMMR('archon', 'SUM', player),
    '2v2': await getPlayerMMR('2v2', 'SUM', player),
    '3v3': await getPlayerMMR('3v3', 'SUM', player),
    '4v4': await getPlayerMMR('4v4', 'SUM', player),
  };
};

module.exports = {
  getPlayerProfile,
  getPlayerLadders,
  getPlayerMatches,
  getPlayerMMR,
  getPlayerAllLaddersSummary,
};

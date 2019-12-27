const fp = require('fastify-plugin');
const StarCraft2API = require('starcraft2-api');
const BlizzAPI = require('blizzapi');
const sc2utils = require('../utils/starcraft2');
const bnetConfig = require('../config/battlenet');

function sc2pte(fastify, options, next) { // eslint-disable-line consistent-return
  function blizzAPI(regionId) {
    return new BlizzAPI({
      region: BlizzAPI.getRegionNameById(regionId)[0],
      clientId: bnetConfig.apiKey,
      clientSecret: bnetConfig.apiSecret,
    });
  }

  function SC2API(regionId) {
    return new StarCraft2API({
      region: BlizzAPI.getRegionNameById(regionId)[0],
      clientId: bnetConfig.apiKey,
      clientSecret: bnetConfig.apiSecret,
    });
  }

  async function getHeader(configObject) {
    try {
      const { regionId, realmId, playerId } = configObject;
      const playerProfile = await SC2API(regionId).queryProfile({
        regionId,
        realmId,
        profileId: playerId,
      });

      const headerObject = {
        player: {
          server: BlizzAPI.getRegionNameById(regionId)[0],
          name: playerProfile.summary.displayName,
          clan: {
            name: playerProfile.summary.clanName || '',
            tag: playerProfile.summary.clanTag || '',
          },
          rank: sc2utils.determineHighestRank(
            playerProfile.career.current1v1LeagueName,
            playerProfile.career.currentBestTeamLeagueName,
          ),
          portrait: playerProfile.summary.portrait,
        },
      };
      return headerObject;
    } catch (error) {
      return {
        player: {
          server: '',
          name: '',
          clan: {
            name: '',
            tag: '',
          },
          rank: '',
          portrait: '',
        },
      };
    }
  }
  async function getPlayerDataFromLadder(configObject, ladderObject) {
    const { regionId, realmId, playerId } = configObject;
    const { ladderId, rank } = ladderObject;

    const playerLadder = await blizzAPI(regionId).query(`/sc2/profile/${regionId}/${realmId}/${playerId}/ladder/${ladderId}`);
    const playerLadderLeague = playerLadder.league;
    const playerLadderData = playerLadder.ladderTeams[rank - 1];

    return {
      mode: ladderObject.localizedGameMode.split(' ')[0],
      rank: playerLadderLeague,
      ladderPosition: rank,
      ...playerLadderData,
    };
  }

  async function getPlayerLadders(configObject) {
    const { regionId, realmId, playerId } = configObject;
    const playerLadderObject = await blizzAPI(regionId).query(
      `/sc2/profile/${regionId}/${realmId}/${playerId}/ladder/summary`,
    );
    const playerLadders = playerLadderObject.allLadderMemberships;
    const playerLadderData = await Promise.all(
      playerLadders.map(
        playerLadder => getPlayerDataFromLadder(
          configObject,
          playerLadder,
        ),
      ),
    );
    return playerLadderData;
  }

  async function getLaddersData(configObject) {
    const playerLadders = await getPlayerLadders(configObject); // eslint-disable-line
    let ladderObject = { // eslint-disable-line
      '1v1': {
        totalLadders: 0,
        topRankId: -1,
        topRank: '',
        topRankTier: -1,
        topMMR: 0,
        wins: 0,
        losses: 0,
      },
      archon: {
        totalLadders: 0,
        topRankId: -1,
        topRank: '',
        topRankTier: -1,
        topMMR: 0,
        wins: 0,
        losses: 0,
      },
      '2v2': {
        totalLadders: 0,
        topRankId: -1,
        topRank: '',
        topRankTier: -1,
        topMMR: 0,
        wins: 0,
        losses: 0,
      },
      '3v3': {
        totalLadders: 0,
        topRankId: -1,
        topRank: '',
        topRankTier: -1,
        topMMR: 0,
        wins: 0,
        losses: 0,
      },
      '4v4': {
        totalLadders: 0,
        topRankId: -1,
        topRank: '',
        topRankTier: -1,
        topMMR: 0,
        wins: 0,
        losses: 0,
      },
    };

    playerLadders.map((ladder) => { // eslint-disable-line array-callback-return
      const ladderMode = ladder.mode === 'Archon' ? 'archon' : ladder.mode;
      ladderObject[ladderMode].totalLadders += 1;

      if (ladder.rank) {
        ladderObject[ladderMode].topRankId = sc2utils.determineRankIdByName(ladder.rank)
        > ladderObject[ladderMode].topRankId
          ? sc2utils.determineRankIdByName(ladder.rank)
          : ladderObject[ladderMode].topRankId;
      }
      if (ladder.ladderPosition) {
        ladderObject[ladderMode].topRankTier = sc2utils.determineRankIdByName(ladder.rank)
          > ladderObject[ladderMode].topRankId
          ? ladderObject[ladderMode].topRankTier
          : ladder.ladderPosition;
      }

      ladderObject[ladderMode].topRank = sc2utils.determineRankNameById(
        ladderObject[ladderMode].topRankId,
      );

      if (ladder.mmr) {
        ladderObject[ladderMode].topMMR = ladderObject[ladderMode].topMMR > ladder.mmr
          ? ladderObject[ladderMode].topMMR
          : ladder.mmr;
      }

      if (ladder.wins) {
        ladderObject[ladderMode].wins += ladder.wins;
      }

      if (ladder.losses) {
        ladderObject[ladderMode].losses += ladder.losses;
      }
    });
    return ladderObject;
  }

  async function getViewerData(configObject) { // eslint-disable-line consistent-return
    try {
      const header = await getHeader(configObject);
      const ladders = await getLaddersData(configObject);
      return {
        status: 200,
        selectedView: 'summary',
        ...header,
        ladders,
      };
    } catch (error) {
      fastify.log.error(error);
      next(new Error(error));
    }
  }

  fastify.decorate('sc2pte', {
    getViewerData,
  });

  next();
}

module.exports = fp(sc2pte, {
  fastify: '>=2.0.0',
  name: 'sc2pte',
});

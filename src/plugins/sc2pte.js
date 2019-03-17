const fp = require('fastify-plugin');
const { StarCraft2API } = require('starcraft2-api');
const { BlizzUtils } = require('blizzapi');
const sc2utils = require('../utils/starcraft2');
const bnetConfig = require('../config/battlenet');

function sc2pte(fastify, options, next) { // eslint-disable-line consistent-return
  async function getHeader(configObject) {
    try {
      const { regionId, realmId, playerId } = configObject;
      const SC2API = new StarCraft2API(regionId, bnetConfig.apiKey, bnetConfig.apiSecret);
      const playerProfile = await SC2API.queryProfile(regionId, realmId, playerId);
      const headerObject = {
        player: {
          server: BlizzUtils.getRegionNameById(regionId)[0],
          name: playerProfile.summary.displayName,
          clan: {
            name: playerProfile.summary.clanName,
            tag: playerProfile.summary.clanTag,
          },
          rank: sc2utils.determineHighestRank(
            playerProfile.career.current1v1LeagueName,
            playerProfile.career.currentBestTeamLeagueName,
          ),
          portrait: playerProfile.summary.portrait,
        },
      };
      console.log(headerObject);
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

  // async function getLadders(configObject) {
  //   return configObject;
  // }

  async function getViewerData(configObject) { // eslint-disable-line consistent-return
    console.log(configObject); // eslint-disable-line
    try {
      const header = await getHeader(configObject);
      // const ladders = await getLadders(configObject);
      const response = {
        status: 200,
        selectedView: 'summary',
        ...header,
        ladders: {
          '1v1': {
            totalLadders: 1,
            topRankId: 4,
            topRank: 'DIAMOND',
            topPosition: 1,
            topMMR: 3744,
            wins: 131,
            losses: 124,
          },
          archon: {
            totalLadders: 0,
            topRankId: -1,
            topRank: '',
            topPosition: 1,
            topMMR: 0,
            wins: 0,
            losses: 0,
          },
          '2v2': {
            totalLadders: 2,
            topRankId: 4,
            topRank: 'DIAMOND',
            topPosition: 1,
            topMMR: 3073,
            wins: 7,
            losses: 18,
          },
          '3v3': {
            totalLadders: 1,
            topRankId: 1,
            topRank: 'SILVER',
            topPosition: 1,
            topMMR: 2876,
            wins: 6,
            losses: 3,
          },
          '4v4': {
            totalLadders: 0,
            topRankId: -1,
            topRank: '',
            topPosition: 1,
            topMMR: 0,
            wins: 0,
            losses: 0,
          },
        },
      };
      return response;
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

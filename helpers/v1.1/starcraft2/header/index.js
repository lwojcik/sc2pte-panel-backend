const sc2playerApi = require('../../../../api/v1.1/starcraft2/player');
const { determineRegionNameById } = require('../../../../helpers/v1.1/battlenet');
const { determineHighestRank } = require('../../../../helpers/v1.1/starcraft2/ladder');
const logging = require('../../../../config/shared/logging');

const formatHeaderData = data => ({
  player: {
    server: data.server,
    name: data.displayName,
    clan: {
      name: data.clanName || '',
      tag: data.clanTag || '',
    },
    rank: determineHighestRank(
      data.current1v1LeagueName,
      data.currentBestTeamLeagueName,
    ),
    portrait: data.portrait || '',
  },
});

const getHeaderData = async (player) => {
  // logging.info(`getHeaderData(${JSON.stringify(player)})`);

  try {
    const playerProfileData = await sc2playerApi.getPlayerProfile(player);
    const playerServer = determineRegionNameById(player.regionId);
    const playerData = await {
      ...playerProfileData.summary,
      ...playerProfileData.career,
      server: playerServer,
    };
    return formatHeaderData(playerData);
  } catch (error) {
    return {
      player: 'undefined',
    };
  }
};

module.exports = {
  getHeaderData,
};

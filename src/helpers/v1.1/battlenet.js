const sc2Config = require('../../config/v1.1/api/starcraft2');

const determineRegionIdByRegionName = (regionName) => {
  switch (regionName) {
    case 'us':
      return 1;
    case 'eu':
      return 2;
    case 'kr':
      return 3;
    case 'ch':
      return 5;
    default:
      return 1;
  }
};

const determineRegionNameById = (regionId) => {
  const regionIdAsString = regionId.toString();
  switch (regionIdAsString) {
    case '1':
      return 'us';
    case '2':
      return 'eu';
    case '3':
      return 'kr';
    case '5':
      return 'ch';
    default:
      return 'us';
  }
};

const determineRankIdByName = rankName => sc2Config.matchMaking.ranks.indexOf(rankName.toUpperCase());

module.exports = {
  determineRegionIdByRegionName,
  determineRegionNameById,
  determineRankIdByName,
};

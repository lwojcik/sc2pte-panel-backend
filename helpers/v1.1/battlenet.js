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
  switch (regionId) {
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

module.exports = {
  determineRegionIdByRegionName,
  determineRegionNameById,
};

const header = require('./header/index');
const ladder = require('./ladder/index');

const getDataView = async player => ({
  header: await header.getHeaderData(player),
  ladders: await ladder.getLadderData(player),
});

module.exports = {
  get: getDataView,
};

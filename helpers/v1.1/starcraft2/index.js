const header = require('./header/index');
const ladder = require('./ladder/index');

const getDataView = async player => ({
  header: await header.getData(player),
  ladders: await ladder.getData(player),
});

module.exports = {
  get: getDataView,
};

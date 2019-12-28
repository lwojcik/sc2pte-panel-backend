const fp = require('fastify-plugin');
const fs = require('fs');

function snapshot(fastify, options, next) { // eslint-disable-line consistent-return
  const { dataDir } = options;

  function getViewerData(channelId) {
    try {
      const content = fs.readFileSync(`${dataDir}/${channelId}.json`, 'utf8');
      const contentObject = JSON.parse(content);
      if (contentObject.player && contentObject.ladders) {
        return content;
      }
      return fs.readFileSync(`${dataDir}/blank.json`, 'utf8');
    } catch (error) {
      return fs.readFileSync(`${dataDir}/blank.json`, 'utf8');
    }
  }

  fastify.decorate('snapshot', {
    getViewerData,
  });

  next();
}

module.exports = fp(snapshot, {
  fastify: '>=2.0.0',
  name: 'snapshot',
});

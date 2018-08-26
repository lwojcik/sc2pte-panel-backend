/**
 * @file    Route enumeration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2017-12-17
 */

/* eslint-disable global-require */
module.exports = (app) => {
  app.use('/v0/config', require('./routes/v0/config'));
  app.use('/v0/viewer', require('./routes/v0/viewer'));
  app.use('/status', require('./routes/status'));
};
/* eslint-enable global-require */

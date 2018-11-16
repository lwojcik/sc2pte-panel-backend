/**
 * @file    Route enumeration file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2017-12-17
 */

/* eslint-disable global-require */
module.exports = (app) => {
  app.use('/v1/config', require('./routes/v1/config'));
  app.use('/v1/viewer', require('./routes/v1/viewer'));
  app.use('/v1.1/config', require('./routes/v1.1/config'));
  app.use('/v1.1/viewer', require('./routes/v1.1/viewer'));
  app.use('/status', require('./routes/status'));
};
/* eslint-enable global-require */

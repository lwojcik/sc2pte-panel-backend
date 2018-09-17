/**
 * @file    Main application file.
 * @author  Łukasz Wójcik
 * @license MIT
 * @since   2018-06-19
 */

require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');

const config = require('./config/app');
const db = require('./config/database');
const ssl = require('./config/ssl');
const logging = require('./config/logging');

const app = express();

/** Compression middleware */
app.use(compression());

/** Logging */
app.use(morgan('combined', { stream: logging.stream }));

/** Database events */
mongoose.connection.once('open', () => {
  logging.info('MongoDB event open');
  logging.info('MongoDB connected');

  mongoose.connection.on('connected', () => {
    logging.info('MongoDB event connected');
  });

  mongoose.connection.on('disconnected', () => {
    logging.warn('MongoDB event disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logging.info('MongoDB event reconnected');
  });

  mongoose.connection.on('error', (err) => {
    logging.error(`MongoDB event error: ${err}`);
  });
});

/** Body parsing middleware */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Securing the app by setting various HTTP headers */
app.use(helmet());

/** Applying JSON indentation for development environment */
if (process.env.NODE_ENV !== 'production') {
  app.set('json spaces', 2);
}

// Add headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,channelId,server,playerid,region,name,token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/** Routes */
require('./routes')(app);

/** SSL configuration */
const options = {
  key: fs.readFileSync(ssl.key),
  cert: fs.readFileSync(ssl.cert),
};

/** Error handler */
app.use((err, req, res, error) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? error : {};

  logging.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500);
  res.render('error');
});

/** Exposing HTTP or HTTPS server depending on .env config */
const createServer = (protocol, appToServe, callback) => {
  if (protocol === 'https') {
    return https.createServer(options, appToServe).listen(config.port, callback);
  }
  return http.createServer(app).listen(config.port, callback);
};

/** App server creation */
module.exports = mongoose.connect(db.connectionString)
  .then(() => {
    createServer(config.protocol, app, () => {
      console.log(`${config.protocol} server started at port ${config.port}`); // eslint-disable-line no-console
    });
  })
  .catch((err) => {
    console.log(`Unable to start the server. Error: ${err}`); // eslint-disable-line no-console
  });

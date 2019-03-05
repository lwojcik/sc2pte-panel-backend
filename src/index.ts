require('dotenv').config();

import fs = require('fs');
import http = require('http');
import https = require('https');
import express = require('express');
import bodyParser = require('body-parser');
import compression = require('compression');
import morgan = require('morgan');
import helmet = require('helmet');
import mongoose = require('mongoose');

import config = require('./config/shared/app');
import db = require('./config/shared/database');
import ssl from './config/shared/ssl';
import logging from './config/shared/logging';

const app: express.Application = express();

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
app.use(({}, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,channelId,regionId,realmId,playerId,token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/** Routes */
require('./routes')(app);

/** SSL configuration */
const options = {
  key: fs.readFileSync(ssl.key),
  cert: fs.readFileSync(ssl.cert),
};

/** Exposing HTTP or HTTPS server depending on .env config */
const createServer = (protocol: string, appToServe: express.Application, callback: CallableFunction) => {
  if (protocol === 'https') {
    return https.createServer(options, appToServe).listen(config.port, callback);
  }
  return http.createServer(app).listen(config.port, callback);
};

/** App server creation */
export default mongoose.connect(db.connectionString, { useNewUrlParser: true })
  .then(() => {
    createServer(config.protocol, app, () => {
      console.log(`${config.protocol} server started at port ${config.port}`);
    });
  })
  .catch((err) => {
    console.log(`Unable to start the server. Error: ${err}`);
  });
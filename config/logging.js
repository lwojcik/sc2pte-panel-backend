const appRoot = require('app-root-path');
const winston = require('winston');
require('winston-daily-rotate-file');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app-%DATE%.log`,
    handleExceptions: true,
    json: true,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new (winston.transports.DailyRotateFile)(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = logger;

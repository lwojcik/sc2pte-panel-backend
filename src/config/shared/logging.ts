const { createLogger, format, transports } = require('winston');

const options = {
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf((info:any) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  handleExceptions: true,
  json: false,
  colorize: true,
};

const logger = createLogger({
  transports: [
    new transports.Console(options),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: (message:string) => {
    logger.info(message);
  },
};

export default logger;

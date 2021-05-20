import { createLogger, Logger, format, transports } from 'winston';

const { combine, colorize, errors, printf, timestamp, json } = format;

let logger: Logger;

const devLogFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} ${level}: ${stack || message}`;
});

const buildDevLogger = () => {
  return createLogger({
    level: 'info',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      devLogFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'all.log' }),
    ],
  });
};

const buildProdLogger = () => {
  return createLogger({
    level: 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'prod-error.log', level: 'error' }),
      new transports.File({ filename: 'prod-all.log' }),
    ],
  });
};

if (process.env.NODE_ENV === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;

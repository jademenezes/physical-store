import winston, { transport } from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: `${__dirname}/../logs/error.json`,
      level: 'error',
    }),
    new winston.transports.File({
      filename: `${__dirname}/../logs/combined.json`,
    }),
  ],
});

export default logger;

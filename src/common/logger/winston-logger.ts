import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import config from 'src/config/config';

const customFormat = winston.format.printf(
  ({ level, message, timestamp, context }) => {
    return `[${timestamp}] [${level.toUpperCase()}]${context ? ' [' + context + ']' : ''}: ${message}`;
  },
);

export const winstonLoggerConfig = {
  transports:
    config.allowPrintErrorLog === 'Y'
      ? [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(
              'Hospital Management',
              {
                prettyPrint: true,
              },
            ),
          ),
        }),

        new winston.transports.File({
          filename: config.errorLogFilePath,
          format: winston.format.combine(
            winston.format.timestamp(),
            customFormat,
          ),
        }),
      ]
      : [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(
              'Hospital Management',
              {
                prettyPrint: true,
              },
            ),
          ),
        }),
      ],
};

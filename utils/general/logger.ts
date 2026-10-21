// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info', // shows info, warn, error (not debug, to keep it light)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
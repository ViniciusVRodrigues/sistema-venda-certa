import winston from 'winston';

export interface LoggerConfig {
  level?: string;
  filename?: string;
  consoleOutput?: boolean;
}

export class Logger {
  private static instance: winston.Logger;

  static getInstance(config: LoggerConfig = {}): winston.Logger {
    if (!Logger.instance) {
      const {
        level = 'info',
        filename = 'app.log',
        consoleOutput = true
      } = config;

      const transports: winston.transport[] = [
        new winston.transports.File({
          filename,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      ];

      if (consoleOutput) {
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          })
        );
      }

      Logger.instance = winston.createLogger({
        level,
        transports
      });
    }

    return Logger.instance;
  }

  static info(message: string, meta?: any): void {
    this.getInstance().info(message, meta);
  }

  static error(message: string, meta?: any): void {
    this.getInstance().error(message, meta);
  }

  static warn(message: string, meta?: any): void {
    this.getInstance().warn(message, meta);
  }

  static debug(message: string, meta?: any): void {
    this.getInstance().debug(message, meta);
  }
}
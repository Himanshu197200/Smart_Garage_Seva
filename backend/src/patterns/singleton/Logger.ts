import fs from 'fs';
import path from 'path';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

class Logger {
  private static instance: Logger;
  private logs: string[] = [];
  private logFile: string;

  private constructor() {
    this.logFile = path.join(__dirname, '../../../logs/app.log');
    this.ensureLogDirectory();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDirectory(): void {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${level}] ${timestamp}: ${message}`;
  }

  private writeLog(formattedMessage: string): void {
    this.logs.push(formattedMessage);
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch {
      // silent
    }
  }

  public info(message: string): void {
    const log = this.formatMessage(LogLevel.INFO, message);
    this.writeLog(log);
    console.log(log);
  }

  public error(message: string, error?: Error): void {
    let log = this.formatMessage(LogLevel.ERROR, message);
    if (error) {
      log += `\nStack: ${error.stack}`;
    }
    this.writeLog(log);
    console.error(log);
  }

  public warn(message: string): void {
    const log = this.formatMessage(LogLevel.WARN, message);
    this.writeLog(log);
    console.warn(log);
  }

  public debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      const log = this.formatMessage(LogLevel.DEBUG, message);
      this.writeLog(log);
      console.debug(log);
    }
  }

  public getLogs(): string[] {
    return [...this.logs];
  }
}

export default Logger;

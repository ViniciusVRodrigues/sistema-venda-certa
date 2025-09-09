// Padrão Singleton - Logger
export class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    
    this.logs.push(logMessage);
    
    // Mantém apenas os últimos 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
    
    console.log(logMessage);
  }

  public info(message: string): void {
    this.log('INFO', message);
  }

  public warn(message: string): void {
    this.log('WARN', message);
  }

  public error(message: string): void {
    this.log('ERROR', message);
  }

  public getLogs(): string[] {
    return [...this.logs]; // Retorna uma cópia para evitar modificações externas
  }

  public clearLogs(): void {
    this.logs = [];
    this.log('INFO', 'Logs limpos');
  }

  public getLogsByLevel(level: 'INFO' | 'WARN' | 'ERROR'): string[] {
    return this.logs.filter(log => log.includes(`${level}:`));
  }
}

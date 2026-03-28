import mongoose from 'mongoose';
import Logger from './Logger';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: mongoose.Connection | null = null;
  private isConnectedFlag: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedFlag) {
      Logger.getInstance().info('Database already connected');
      return;
    }
    try {
      await mongoose.connect(uri);
      this.connection = mongoose.connection;
      this.isConnectedFlag = true;
      Logger.getInstance().info('Database connected successfully');
    } catch (error) {
      Logger.getInstance().error(`Database connection failed: ${error}`);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedFlag) return;
    await mongoose.disconnect();
    this.isConnectedFlag = false;
    Logger.getInstance().info('Database disconnected');
  }

  public getConnection(): mongoose.Connection | null {
    return this.connection;
  }

  public isConnectedStatus(): boolean {
    return this.isConnectedFlag;
  }
}

export default DatabaseConnection;

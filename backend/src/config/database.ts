import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Padrão Singleton - DatabaseConnection
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize({
      database: process.env.DB_DATABASE || 'venda_certa',
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: false, // Database schema doesn't include createdAt/updatedAt
        underscored: false, // Keep camelCase as defined in schema
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
      console.error('Erro ao conectar com o banco de dados:', error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('Conexão com o banco de dados encerrada.');
    } catch (error) {
      console.error('Erro ao encerrar conexão com o banco:', error);
    }
  }
}

const sequelize = DatabaseConnection.getInstance().getSequelize();
export default sequelize;
export { DatabaseConnection };
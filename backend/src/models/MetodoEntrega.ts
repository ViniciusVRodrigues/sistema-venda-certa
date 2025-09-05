import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MetodoEntregaAttributes {
  id: number;
  descricao?: string;
  tipo: string;
  estimativaEntrega?: string;
  status: number;
  nome: string;
  preco: number;
}

interface MetodoEntregaCreationAttributes extends Optional<MetodoEntregaAttributes, 'id'> {}

class MetodoEntrega extends Model<MetodoEntregaAttributes, MetodoEntregaCreationAttributes> implements MetodoEntregaAttributes {
  public id!: number;
  public descricao?: string;
  public tipo!: string;
  public estimativaEntrega?: string;
  public status!: number;
  public nome!: string;
  public preco!: number;
}

MetodoEntrega.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    estimativaEntrega: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'metodoEntrega',
    timestamps: false,
  }
);

export default MetodoEntrega;
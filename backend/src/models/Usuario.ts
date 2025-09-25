import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UsuarioAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  numeroCelular?: string;
  status: number;
  totalPedidos: number;
  totalGasto: number;
  entregasFeitas: number;
  nota?: number;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id' | 'totalPedidos' | 'totalGasto' | 'entregasFeitas'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public cargo!: string;
  public numeroCelular?: string;
  public status!: number;
  public totalPedidos!: number;
  public totalGasto!: number;
  public entregasFeitas!: number;
  public nota?: number;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    numeroCelular: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    totalPedidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalGasto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    entregasFeitas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nota: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'usuario',
    timestamps: false,
  }
);

export default Usuario;
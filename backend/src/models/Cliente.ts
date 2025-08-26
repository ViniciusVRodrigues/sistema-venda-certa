import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interface para os atributos do Cliente
interface ClienteAttributes {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  avatar?: string;
  isVip?: boolean;
  isBlocked?: boolean;
  totalPedidos?: number;
  totalGasto?: number;
  ultimoPedidoData?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação (campos opcionais)
interface ClienteCreationAttributes extends Optional<ClienteAttributes, 'id' | 'isVip' | 'isBlocked' | 'totalPedidos' | 'totalGasto' | 'ultimoPedidoData' | 'createdAt' | 'updatedAt'> {}

// Classe do Model
class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public telefone?: string;
  public avatar?: string;
  public isVip?: boolean;
  public isBlocked?: boolean;
  public totalPedidos?: number;
  public totalGasto?: number;
  public ultimoPedidoData?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definição do modelo
Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[\(\)\s\-\+\d]+$/
      }
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isVip: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalPedidos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_pedidos'
    },
    totalGasto: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      field: 'total_gasto'
    },
    ultimoPedidoData: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ultimo_pedido_data'
    }
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['nome']
      }
    ]
  }
);

export default Cliente;
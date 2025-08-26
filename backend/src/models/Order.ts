import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Order status enum
export enum OrderStatus {
  PENDENTE = 'pendente',
  CONFIRMADO = 'confirmado',
  PREPARANDO = 'preparando',
  ENVIADO = 'enviado',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado'
}

// Payment method enum
export enum PaymentMethod {
  DINHEIRO = 'dinheiro',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  PIX = 'pix',
  BOLETO = 'boleto'
}

// Order attributes interface
interface OrderAttributes {
  id: number;
  clienteId: number;
  numeroComanda: string;
  status: OrderStatus;
  metodoPagamento: PaymentMethod;
  subtotal: number;
  desconto?: number;
  taxaEntrega?: number;
  total: number;
  observacoes?: string;
  enderecoEntrega?: string;
  telefoneContato?: string;
  dataEntrega?: Date;
  dataConfirmacao?: Date;
  dataCancelamento?: Date;
  motivoCancelamento?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Order model class
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public clienteId!: number;
  public numeroComanda!: string;
  public status!: OrderStatus;
  public metodoPagamento!: PaymentMethod;
  public subtotal!: number;
  public desconto?: number;
  public taxaEntrega?: number;
  public total!: number;
  public observacoes?: string;
  public enderecoEntrega?: string;
  public telefoneContato?: string;
  public dataEntrega?: Date;
  public dataConfirmacao?: Date;
  public dataCancelamento?: Date;
  public motivoCancelamento?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    clienteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    numeroComanda: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDENTE
    },
    metodoPagamento: {
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    desconto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    taxaEntrega: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enderecoEntrega: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefoneContato: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dataEntrega: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dataConfirmacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dataCancelamento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    motivoCancelamento: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'pedidos',
    timestamps: true,
    indexes: [
      {
        fields: ['clienteId']
      },
      {
        fields: ['numeroComanda']
      },
      {
        fields: ['status']
      },
      {
        fields: ['metodoPagamento']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['dataEntrega']
      }
    ]
  }
);

export { Order };
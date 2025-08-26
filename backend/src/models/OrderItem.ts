import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// OrderItem attributes interface
interface OrderItemAttributes {
  id: number;
  pedidoId: number;
  produtoId: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  subtotal: number;
  observacoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// OrderItem model class
class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public pedidoId!: number;
  public produtoId!: number;
  public nomeProduto!: string;
  public precoProduto!: number;
  public quantidade!: number;
  public subtotal!: number;
  public observacoes?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    pedidoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    produtoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    nomeProduto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Nome do produto no momento da compra'
    },
    precoProduto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'Preço do produto no momento da compra'
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      },
      comment: 'precoProduto * quantidade'
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observações específicas do item (ex: sem cebola, ponto da carne, etc.)'
    }
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'itens_pedido',
    timestamps: true,
    indexes: [
      {
        fields: ['pedidoId']
      },
      {
        fields: ['produtoId']
      }
    ]
  }
);

export { OrderItem };
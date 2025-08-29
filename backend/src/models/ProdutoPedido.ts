import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProdutoPedidoAttributes {
  id: number;
  quantidade: number;
  preco: number;
  fk_produto_id: number;
  fk_pedido_id: number;
}

interface ProdutoPedidoCreationAttributes extends Optional<ProdutoPedidoAttributes, 'id'> {}

class ProdutoPedido extends Model<ProdutoPedidoAttributes, ProdutoPedidoCreationAttributes> implements ProdutoPedidoAttributes {
  public id!: number;
  public quantidade!: number;
  public preco!: number;
  public fk_produto_id!: number;
  public fk_pedido_id!: number;
}

ProdutoPedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fk_produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produto',
        key: 'id',
      },
    },
    fk_pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedido',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'produtoPedido',
    timestamps: false,
  }
);

export default ProdutoPedido;
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AtualizacaoPedidoAttributes {
  id: number;
  status: number;
  timestamp: Date;
  descricao?: string;
  fk_usuario_id?: number;
  fk_pedido_id: number;
}

interface AtualizacaoPedidoCreationAttributes extends Optional<AtualizacaoPedidoAttributes, 'id'> {}

class AtualizacaoPedido extends Model<AtualizacaoPedidoAttributes, AtualizacaoPedidoCreationAttributes> implements AtualizacaoPedidoAttributes {
  public id!: number;
  public status!: number;
  public timestamp!: Date;
  public descricao?: string;
  public fk_usuario_id?: number;
  public fk_pedido_id!: number;
}

AtualizacaoPedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fk_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
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
    tableName: 'atualizacaoPedido',
    timestamps: false,
  }
);

export default AtualizacaoPedido;
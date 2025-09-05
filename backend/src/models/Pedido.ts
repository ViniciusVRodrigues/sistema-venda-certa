import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PedidoAttributes {
  id: number;
  status: number;
  total: number;
  subtotal: number;
  taxaEntrega: number;
  statusPagamento: number;
  anotacoes?: string;
  motivoCancelamento?: string;
  estimativaEntrega?: Date;
  dataEntrega?: Date;
  fk_entregador_id?: number;
  fk_metodoPagamento_id: number;
  fk_usuario_id: number;
  fk_metodoEntrega_id: number;
  fk_endereco_id: number;
}

interface PedidoCreationAttributes extends Optional<PedidoAttributes, 'id'> {}

class Pedido extends Model<PedidoAttributes, PedidoCreationAttributes> implements PedidoAttributes {
  public id!: number;
  public status!: number;
  public total!: number;
  public subtotal!: number;
  public taxaEntrega!: number;
  public statusPagamento!: number;
  public anotacoes?: string;
  public motivoCancelamento?: string;
  public estimativaEntrega?: Date;
  public dataEntrega?: Date;
  public fk_entregador_id?: number;
  public fk_metodoPagamento_id!: number;
  public fk_usuario_id!: number;
  public fk_metodoEntrega_id!: number;
  public fk_endereco_id!: number;
}

Pedido.init(
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
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    taxaEntrega: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    statusPagamento: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    anotacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    motivoCancelamento: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimativaEntrega: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dataEntrega: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fk_entregador_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id',
      },
    },
    fk_metodoPagamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodoPagamento',
        key: 'id',
      },
    },
    fk_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id',
      },
    },
    fk_metodoEntrega_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodoEntrega',
        key: 'id',
      },
    },
    fk_endereco_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'endereco',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'pedido',
    timestamps: false,
  }
);

export default Pedido;
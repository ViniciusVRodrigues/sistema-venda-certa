import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MetodoPagamentoAttributes {
  id: number;
  nome: string;
  tipo: string;
  ativo: number;
}

interface MetodoPagamentoCreationAttributes extends Optional<MetodoPagamentoAttributes, 'id'> {}

class MetodoPagamento extends Model<MetodoPagamentoAttributes, MetodoPagamentoCreationAttributes> implements MetodoPagamentoAttributes {
  public id!: number;
  public nome!: string;
  public tipo!: string;
  public ativo!: number;
}

MetodoPagamento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    ativo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'metodoPagamento',
    timestamps: false,
  }
);

export default MetodoPagamento;
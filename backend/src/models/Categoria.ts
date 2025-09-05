import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CategoriaAttributes {
  id: number;
  nome: string;
  descricao?: string;
  estaAtiva: boolean;
}

interface CategoriaCreationAttributes extends Optional<CategoriaAttributes, 'id'> {}

class Categoria extends Model<CategoriaAttributes, CategoriaCreationAttributes> implements CategoriaAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public estaAtiva!: boolean;
}

Categoria.init(
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
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estaAtiva: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'categoria',
    timestamps: false,
  }
);

export default Categoria;
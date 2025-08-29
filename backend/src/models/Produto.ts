import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProdutoAttributes {
  id: number;
  sku?: string;
  nome: string;
  descricao?: string;
  descricaoResumida?: string;
  preco: number;
  medida: string;
  estoque: number;
  status: number;
  imagem?: Buffer;
  tags?: string;
  fk_categoria_id: number;
}

interface ProdutoCreationAttributes extends Optional<ProdutoAttributes, 'id'> {}

class Produto extends Model<ProdutoAttributes, ProdutoCreationAttributes> implements ProdutoAttributes {
  public id!: number;
  public sku?: string;
  public nome!: string;
  public descricao?: string;
  public descricaoResumida?: string;
  public preco!: number;
  public medida!: string;
  public estoque!: number;
  public status!: number;
  public imagem?: Buffer;
  public tags?: string;
  public fk_categoria_id!: number;
}

Produto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descricaoResumida: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    medida: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.BLOB('medium'),
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fk_categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'produto',
    timestamps: false,
  }
);

export default Produto;
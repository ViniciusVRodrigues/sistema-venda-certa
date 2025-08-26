import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Product attributes interface
interface ProductAttributes {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  precoPromocional?: number;
  categoria?: string;
  marca?: string;
  sku?: string;
  codigoBarras?: string;
  estoque: number;
  estoqueMinimo?: number;
  imagemPrincipal?: string;
  imagens?: string;
  peso?: number;
  dimensoes?: string;
  ativo: boolean;
  destaque: boolean;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  totalVendas?: number;
  tags?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Product model class
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public preco!: number;
  public precoPromocional?: number;
  public categoria?: string;
  public marca?: string;
  public sku?: string;
  public codigoBarras?: string;
  public estoque!: number;
  public estoqueMinimo?: number;
  public imagemPrincipal?: string;
  public imagens?: string;
  public peso?: number;
  public dimensoes?: string;
  public ativo!: boolean;
  public destaque!: boolean;
  public avaliacaoMedia?: number;
  public totalAvaliacoes?: number;
  public totalVendas?: number;
  public tags?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [2, 255],
        notEmpty: true
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    precoPromocional: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    codigoBarras: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    estoqueMinimo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    imagemPrincipal: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    imagens: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array of image URLs'
    },
    peso: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    dimensoes: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Format: LxWxH in cm'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    avaliacaoMedia: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5
      }
    },
    totalAvaliacoes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    totalVendas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Comma-separated tags for search'
    }
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'produtos',
    timestamps: true,
    indexes: [
      {
        fields: ['nome']
      },
      {
        fields: ['categoria']
      },
      {
        fields: ['marca']
      },
      {
        fields: ['ativo']
      },
      {
        fields: ['destaque']
      },
      {
        fields: ['preco']
      }
    ]
  }
);

export { Product };
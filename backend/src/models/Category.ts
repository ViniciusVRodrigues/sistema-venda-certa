import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Category attributes interface
interface CategoryAttributes {
  id: number;
  nome: string;
  descricao?: string;
  slug: string;
  imagem?: string;
  icone?: string;
  cor?: string;
  parentId?: number;
  ordem?: number;
  ativo: boolean;
  destaque: boolean;
  totalProdutos?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Category model class
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public nome!: string;
  public descricao?: string;
  public slug!: string;
  public imagem?: string;
  public icone?: string;
  public cor?: string;
  public parentId?: number;
  public ordem?: number;
  public ativo!: boolean;
  public destaque!: boolean;
  public totalProdutos?: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/i // Only letters, numbers, and hyphens
      }
    },
    imagem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    icone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i // Hex color format
      }
    },
    parentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
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
    totalProdutos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categorias',
    timestamps: true,
    indexes: [
      {
        fields: ['nome']
      },
      {
        fields: ['slug']
      },
      {
        fields: ['parentId']
      },
      {
        fields: ['ativo']
      },
      {
        fields: ['destaque']
      },
      {
        fields: ['ordem']
      }
    ]
  }
);

export { Category };
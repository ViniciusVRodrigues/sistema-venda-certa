const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Produto', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    preco_promocional: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    codigo_barras: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    estoque_minimo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    imagem_principal: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    imagens: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON array of image URLs"
    },
    peso: {
      type: DataTypes.DECIMAL(8,3),
      allowNull: true
    },
    dimensoes: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Format: LxWxH in cm"
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    avaliacao_media: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: true
    },
    total_avaliacoes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    total_vendas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Comma-separated tags for search"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'produtos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "produtos_nome",
        using: "BTREE",
        fields: [
          { name: "nome" },
        ]
      },
      {
        name: "produtos_categoria_id",
        using: "BTREE",
        fields: [
          { name: "categoria_id" },
        ]
      },
      {
        name: "produtos_ativo",
        using: "BTREE",
        fields: [
          { name: "ativo" },
        ]
      },
      {
        name: "produtos_preco",
        using: "BTREE",
        fields: [
          { name: "preco" },
        ]
      },
    ]
  });
};

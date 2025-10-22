const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Categoria', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: "slug"
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
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
    total_produtos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
    tableName: 'categorias',
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
        name: "slug",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
      {
        name: "categorias_nome",
        using: "BTREE",
        fields: [
          { name: "nome" },
        ]
      },
      {
        name: "categorias_slug",
        using: "BTREE",
        fields: [
          { name: "slug" },
        ]
      },
      {
        name: "categorias_parent_id",
        using: "BTREE",
        fields: [
          { name: "parent_id" },
        ]
      },
      {
        name: "categorias_ativo",
        using: "BTREE",
        fields: [
          { name: "ativo" },
        ]
      },
      {
        name: "categorias_destaque",
        using: "BTREE",
        fields: [
          { name: "destaque" },
        ]
      },
      {
        name: "categorias_ordem",
        using: "BTREE",
        fields: [
          { name: "ordem" },
        ]
      },
    ]
  });
};

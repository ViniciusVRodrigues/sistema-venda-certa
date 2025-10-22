const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ItensPedido', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    pedido_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    produto_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id'
      }
    },
    nome_produto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Nome do produto no momento da compra"
    },
    preco_produto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      comment: "Preço do produto no momento da compra"
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      comment: "precoProduto * quantidade"
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observações específicas do item (ex: sem cebola, ponto da carne, etc.)"
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
    tableName: 'itens_pedido',
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
        name: "itens_pedido_pedido_id",
        using: "BTREE",
        fields: [
          { name: "pedido_id" },
        ]
      },
      {
        name: "itens_pedido_produto_id",
        using: "BTREE",
        fields: [
          { name: "produto_id" },
        ]
      },
    ]
  });
};

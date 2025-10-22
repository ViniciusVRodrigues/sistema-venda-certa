const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProdutoPedido', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preco: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fk_produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produto',
        key: 'id'
      }
    },
    fk_pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedido',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'produtoPedido',
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
        name: "fk_produto_id",
        using: "BTREE",
        fields: [
          { name: "fk_produto_id" },
        ]
      },
      {
        name: "fk_pedido_id",
        using: "BTREE",
        fields: [
          { name: "fk_pedido_id" },
        ]
      },
    ]
  });
};

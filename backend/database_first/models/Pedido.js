const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pedido', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    taxaEntrega: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    statusPagamento: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    anotacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    motivoCancelamento: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estimativaEntrega: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dataEntrega: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fk_entregador_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    fk_metodoPagamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodoPagamento',
        key: 'id'
      }
    },
    fk_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    fk_metodoEntrega_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodoEntrega',
        key: 'id'
      }
    },
    fk_endereco_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'endereco',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pedido',
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
        name: "fk_entregador_id",
        using: "BTREE",
        fields: [
          { name: "fk_entregador_id" },
        ]
      },
      {
        name: "fk_metodoPagamento_id",
        using: "BTREE",
        fields: [
          { name: "fk_metodoPagamento_id" },
        ]
      },
      {
        name: "fk_usuario_id",
        using: "BTREE",
        fields: [
          { name: "fk_usuario_id" },
        ]
      },
      {
        name: "fk_metodoEntrega_id",
        using: "BTREE",
        fields: [
          { name: "fk_metodoEntrega_id" },
        ]
      },
      {
        name: "fk_endereco_id",
        using: "BTREE",
        fields: [
          { name: "fk_endereco_id" },
        ]
      },
    ]
  });
};
s: [
          { name: "status" },
        ]
      },
      {
        name: "pedidos_metodo_pagamento",
        using: "BTREE",
        fields: [
          { name: "metodo_pagamento" },
        ]
      },
      {
        name: "pedidos_created_at",
        using: "BTREE",
        fields: [
          { name: "created_at" },
        ]
      },
      {
        name: "pedidos_data_entrega",
        using: "BTREE",
        fields: [
          { name: "data_entrega" },
        ]
      },
    ]
  });
};

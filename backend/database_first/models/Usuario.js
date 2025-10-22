const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Usuario', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "email"
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cargo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    numeroCelular: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    totalPedidos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalGasto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    entregasFeitas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    nota: {
      type: DataTypes.DECIMAL(2,1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuario',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};

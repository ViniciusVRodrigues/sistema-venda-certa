const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Endereco', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rua: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    complemento: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bairro: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    cep: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    favorito: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    fk_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'endereco',
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
        name: "fk_usuario_id",
        using: "BTREE",
        fields: [
          { name: "fk_usuario_id" },
        ]
      },
    ]
  });
};

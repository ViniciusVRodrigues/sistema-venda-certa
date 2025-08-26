import sequelize from '../config/database';
import Cliente from './Cliente';

// Import other models here as they are created
// import Produto from './Produto';
// import Pedido from './Pedido';

const models = {
  Cliente,
  // Add other models here
};

// Define associations here
// Cliente.hasMany(Pedido, { foreignKey: 'clienteId' });
// Pedido.belongsTo(Cliente, { foreignKey: 'clienteId' });

export { sequelize };
export default models;
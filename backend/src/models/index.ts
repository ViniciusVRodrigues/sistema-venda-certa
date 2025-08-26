import sequelize from '../config/database';
import Cliente from './Cliente';
import { Product } from './Product';
import { Category } from './Category';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

const models = {
  Cliente,
  Product,
  Category,
  Order,
  OrderItem
};

// Define associations

// Cliente → Orders (one-to-many)
Cliente.hasMany(Order, { 
  foreignKey: 'clienteId',
  as: 'pedidos'
});
Order.belongsTo(Cliente, { 
  foreignKey: 'clienteId',
  as: 'cliente'
});

// Order → OrderItems (one-to-many)
Order.hasMany(OrderItem, { 
  foreignKey: 'pedidoId',
  as: 'itens'
});
OrderItem.belongsTo(Order, { 
  foreignKey: 'pedidoId',
  as: 'pedido'
});

// Product → OrderItems (one-to-many)
Product.hasMany(OrderItem, { 
  foreignKey: 'produtoId',
  as: 'itensVendidos'
});
OrderItem.belongsTo(Product, { 
  foreignKey: 'produtoId',
  as: 'produto'
});

// Category → Category (self-referencing for subcategories)
Category.hasMany(Category, {
  foreignKey: 'parentId',
  as: 'subcategorias'
});
Category.belongsTo(Category, {
  foreignKey: 'parentId',
  as: 'categoriaPai'
});

// Category → Products (one-to-many through categoria field)
// Note: This is a loose relationship since we're using a string field for categoria
// In a more robust system, we would have a categoryId foreign key

export { sequelize };
export default models;
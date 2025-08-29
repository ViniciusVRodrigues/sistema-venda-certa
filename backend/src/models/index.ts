import Usuario from './Usuario';
import Endereco from './Endereco';
import Categoria from './Categoria';
import Produto from './Produto';
import MetodoEntrega from './MetodoEntrega';
import MetodoPagamento from './MetodoPagamento';
import Pedido from './Pedido';
import ProdutoPedido from './ProdutoPedido';
import AtualizacaoPedido from './AtualizacaoPedido';
import AvaliacaoProduto from './AvaliacaoProduto';

// Define associations based on database schema foreign keys

// Usuario associations
Usuario.hasMany(Endereco, { foreignKey: 'fk_usuario_id', as: 'enderecos' });
Usuario.hasMany(Pedido, { foreignKey: 'fk_usuario_id', as: 'pedidos' });
Usuario.hasMany(Pedido, { foreignKey: 'fk_entregador_id', as: 'entregasAssinadas' });
Usuario.hasMany(AtualizacaoPedido, { foreignKey: 'fk_usuario_id', as: 'atualizacoesPedido' });
Usuario.hasMany(AvaliacaoProduto, { foreignKey: 'fk_usuario_id', as: 'avaliacoesProduto' });

// Endereco associations
Endereco.belongsTo(Usuario, { foreignKey: 'fk_usuario_id', as: 'usuario' });
Endereco.hasMany(Pedido, { foreignKey: 'fk_endereco_id', as: 'pedidos' });

// Categoria associations
Categoria.hasMany(Produto, { foreignKey: 'fk_categoria_id', as: 'produtos' });

// Produto associations
Produto.belongsTo(Categoria, { foreignKey: 'fk_categoria_id', as: 'categoria' });
Produto.hasMany(ProdutoPedido, { foreignKey: 'fk_produto_id', as: 'produtosPedido' });
Produto.hasMany(AvaliacaoProduto, { foreignKey: 'fk_produto_id', as: 'avaliacoes' });

// MetodoEntrega associations
MetodoEntrega.hasMany(Pedido, { foreignKey: 'fk_metodoEntrega_id', as: 'pedidos' });

// MetodoPagamento associations
MetodoPagamento.hasMany(Pedido, { foreignKey: 'fk_metodoPagamento_id', as: 'pedidos' });

// Pedido associations
Pedido.belongsTo(Usuario, { foreignKey: 'fk_usuario_id', as: 'usuario' });
Pedido.belongsTo(Usuario, { foreignKey: 'fk_entregador_id', as: 'entregador' });
Pedido.belongsTo(Endereco, { foreignKey: 'fk_endereco_id', as: 'endereco' });
Pedido.belongsTo(MetodoEntrega, { foreignKey: 'fk_metodoEntrega_id', as: 'metodoEntrega' });
Pedido.belongsTo(MetodoPagamento, { foreignKey: 'fk_metodoPagamento_id', as: 'metodoPagamento' });
Pedido.hasMany(ProdutoPedido, { foreignKey: 'fk_pedido_id', as: 'produtos' });
Pedido.hasMany(AtualizacaoPedido, { foreignKey: 'fk_pedido_id', as: 'atualizacoes' });

// ProdutoPedido associations
ProdutoPedido.belongsTo(Produto, { foreignKey: 'fk_produto_id', as: 'produto' });
ProdutoPedido.belongsTo(Pedido, { foreignKey: 'fk_pedido_id', as: 'pedido' });

// AtualizacaoPedido associations
AtualizacaoPedido.belongsTo(Usuario, { foreignKey: 'fk_usuario_id', as: 'usuario' });
AtualizacaoPedido.belongsTo(Pedido, { foreignKey: 'fk_pedido_id', as: 'pedido' });

// AvaliacaoProduto associations
AvaliacaoProduto.belongsTo(Produto, { foreignKey: 'fk_produto_id', as: 'produto' });
AvaliacaoProduto.belongsTo(Usuario, { foreignKey: 'fk_usuario_id', as: 'usuario' });

export {
  Usuario,
  Endereco,
  Categoria,
  Produto,
  MetodoEntrega,
  MetodoPagamento,
  Pedido,
  ProdutoPedido,
  AtualizacaoPedido,
  AvaliacaoProduto,
};
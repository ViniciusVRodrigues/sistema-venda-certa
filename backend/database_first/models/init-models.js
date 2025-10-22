var DataTypes = require("sequelize").DataTypes;
var _AtualizacaoPedido = require("./AtualizacaoPedido");
var _AvaliacaoProduto = require("./AvaliacaoProduto");
var _Categorium = require("./Categorium");
var _Categoria = require("./Categoria");
var _Cliente = require("./Cliente");
var _Endereco = require("./Endereco");
var _ItensPedido = require("./ItensPedido");
var _MetodoEntrega = require("./MetodoEntrega");
var _MetodoPagamento = require("./MetodoPagamento");
var _Pedido = require("./Pedido");
var _Pedido = require("./Pedido");
var _Produto = require("./Produto");
var _ProdutoPedido = require("./ProdutoPedido");
var _Produto = require("./Produto");
var _Usuario = require("./Usuario");

function initModels(sequelize) {
  var AtualizacaoPedido = _AtualizacaoPedido(sequelize, DataTypes);
  var AvaliacaoProduto = _AvaliacaoProduto(sequelize, DataTypes);
  var Categorium = _Categorium(sequelize, DataTypes);
  var Categoria = _Categoria(sequelize, DataTypes);
  var Cliente = _Cliente(sequelize, DataTypes);
  var Endereco = _Endereco(sequelize, DataTypes);
  var ItensPedido = _ItensPedido(sequelize, DataTypes);
  var MetodoEntrega = _MetodoEntrega(sequelize, DataTypes);
  var MetodoPagamento = _MetodoPagamento(sequelize, DataTypes);
  var Pedido = _Pedido(sequelize, DataTypes);
  var Pedido = _Pedido(sequelize, DataTypes);
  var Produto = _Produto(sequelize, DataTypes);
  var ProdutoPedido = _ProdutoPedido(sequelize, DataTypes);
  var Produto = _Produto(sequelize, DataTypes);
  var Usuario = _Usuario(sequelize, DataTypes);

  Produto.belongsTo(Categorium, { as: "fk_categorium", foreignKey: "fk_categoria_id"});
  Categorium.hasMany(Produto, { as: "produtos", foreignKey: "fk_categoria_id"});
  Categoria.belongsTo(Categoria, { as: "parent", foreignKey: "parent_id"});
  Categoria.hasMany(Categoria, { as: "categoria", foreignKey: "parent_id"});
  Produto.belongsTo(Categoria, { as: "categorium", foreignKey: "categoria_id"});
  Categoria.hasMany(Produto, { as: "produtos", foreignKey: "categoria_id"});
  Pedido.belongsTo(Cliente, { as: "cliente", foreignKey: "cliente_id"});
  Cliente.hasMany(Pedido, { as: "pedidos", foreignKey: "cliente_id"});
  Pedido.belongsTo(Endereco, { as: "fk_endereco", foreignKey: "fk_endereco_id"});
  Endereco.hasMany(Pedido, { as: "pedidos", foreignKey: "fk_endereco_id"});
  Pedido.belongsTo(MetodoEntrega, { as: "fk_metodoEntrega", foreignKey: "fk_metodoEntrega_id"});
  MetodoEntrega.hasMany(Pedido, { as: "pedidos", foreignKey: "fk_metodoEntrega_id"});
  Pedido.belongsTo(MetodoPagamento, { as: "fk_metodoPagamento", foreignKey: "fk_metodoPagamento_id"});
  MetodoPagamento.hasMany(Pedido, { as: "pedidos", foreignKey: "fk_metodoPagamento_id"});
  AtualizacaoPedido.belongsTo(Pedido, { as: "fk_pedido", foreignKey: "fk_pedido_id"});
  Pedido.hasMany(AtualizacaoPedido, { as: "atualizacaoPedidos", foreignKey: "fk_pedido_id"});
  ProdutoPedido.belongsTo(Pedido, { as: "fk_pedido", foreignKey: "fk_pedido_id"});
  Pedido.hasMany(ProdutoPedido, { as: "produtoPedidos", foreignKey: "fk_pedido_id"});
  ItensPedido.belongsTo(Pedido, { as: "pedido", foreignKey: "pedido_id"});
  Pedido.hasMany(ItensPedido, { as: "itens_pedidos", foreignKey: "pedido_id"});
  AvaliacaoProduto.belongsTo(Produto, { as: "fk_produto", foreignKey: "fk_produto_id"});
  Produto.hasMany(AvaliacaoProduto, { as: "avaliacaoProdutos", foreignKey: "fk_produto_id"});
  ProdutoPedido.belongsTo(Produto, { as: "fk_produto", foreignKey: "fk_produto_id"});
  Produto.hasMany(ProdutoPedido, { as: "produtoPedidos", foreignKey: "fk_produto_id"});
  ItensPedido.belongsTo(Produto, { as: "produto", foreignKey: "produto_id"});
  Produto.hasMany(ItensPedido, { as: "itens_pedidos", foreignKey: "produto_id"});
  AtualizacaoPedido.belongsTo(Usuario, { as: "fk_usuario", foreignKey: "fk_usuario_id"});
  Usuario.hasMany(AtualizacaoPedido, { as: "atualizacaoPedidos", foreignKey: "fk_usuario_id"});
  AvaliacaoProduto.belongsTo(Usuario, { as: "fk_usuario", foreignKey: "fk_usuario_id"});
  Usuario.hasMany(AvaliacaoProduto, { as: "avaliacaoProdutos", foreignKey: "fk_usuario_id"});
  Endereco.belongsTo(Usuario, { as: "fk_usuario", foreignKey: "fk_usuario_id"});
  Usuario.hasMany(Endereco, { as: "enderecos", foreignKey: "fk_usuario_id"});
  Pedido.belongsTo(Usuario, { as: "fk_entregador", foreignKey: "fk_entregador_id"});
  Usuario.hasMany(Pedido, { as: "pedidos", foreignKey: "fk_entregador_id"});
  Pedido.belongsTo(Usuario, { as: "fk_usuario", foreignKey: "fk_usuario_id"});
  Usuario.hasMany(Pedido, { as: "fk_usuario_pedidos", foreignKey: "fk_usuario_id"});

  return {
    AtualizacaoPedido,
    AvaliacaoProduto,
    Categorium,
    Categoria,
    Cliente,
    Endereco,
    ItensPedido,
    MetodoEntrega,
    MetodoPagamento,
    Pedido,
    Pedido,
    Produto,
    ProdutoPedido,
    Produto,
    Usuario,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

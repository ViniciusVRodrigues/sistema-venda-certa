/* Logico_Venda_Certa: */

CREATE TABLE usuario (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    cargo VARCHAR(50),
    numeroCelular VARCHAR(20),
    status TINYINT,
    totalPedidos INT,
    totalGasto DECIMAL(10,2),
    entregasFeitas INTEGER,
    nota DECIMAL(2,1)
);

CREATE TABLE endereco (
    id INTEGER PRIMARY KEY,
    rua VARCHAR(100),
    numero VARCHAR(10),
    complemento VARCHAR(50),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VACHAR(2),
    cep VARCHAR(10),
    favorito BOOLEAN,
    fk_usuario_id INTEGER
);

CREATE TABLE produto (
    id INTEGER PRIMARY KEY,
    sku VARCHAR(30) UNIQUE,
    nome VARCHAR(100),
    descricao TEXT,
    descricaoResumida VARCHAR(255),
    preco DECIMAL(10,2),
    medida VARCHAR(20),
    estoque INT,
    status TINYINT,
    imagem MEDIUMBLOB,
    tags VARCHAR(255),
    fk_categoria_id INTEGER
);

CREATE TABLE categoria (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(50),
    descricao VARCHAR(255),
    estaAtiva BOOLEAN
);

CREATE TABLE pedido (
    id INTEGER PRIMARY KEY,
    status TINYINT,
    total DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    taxaEntrega DECIMAL(10,2),
    statusPagamento TINYINT,
    anotacoes TEXT,
    motivoCancelamento TEXT,
    estimativaEntrega DATETIME,
    dataEntrega DATETIME,
    fk_entregador_id INTEGER,
    fk_metodoPagamento_id INTEGER,
    fk_usuario_id INTEGER,
    fk_metodoEntrega_id INTEGER,
    fk_endereco_id INTEGER
);

CREATE TABLE atualizacaoPedido (
    id INTEGER PRIMARY KEY,
    status TINYINT,
    timestamp DATETIME,
    descricao TEXT,
    fk_usuario_id INTEGER,
    fk_pedido_id INTEGER
);

CREATE TABLE metodoEntrega (
    id INTEGER PRIMARY KEY,
    descricao VARCHAR(255),
    tipo VARCHAR(30),
    estimativaEntrega VARCHAR(50),
    status TINYINT,
    nome VARCHAR(50),
    preco DECIMAL(10,2)
);

CREATE TABLE metodoPagamento (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(50),
    tipo VARCHAR(20),
    ativo TINYINT
);

CREATE TABLE avaliacaoProduto (
    id INTEGER PRIMARY KEY,
    avaliacao TINYINT,
    comentario TEXT,
    fk_produto_id INTEGER,
    fk_usuario_id INTEGER
);

CREATE TABLE produtoPedido (
    id INTEGER PRIMARY KEY,
    quantidade INTEGER,
    preco DECIMAL(10,2),
    fk_produto_id INTEGER,
    fk_pedido_id INTEGER
);
 
ALTER TABLE endereco ADD CONSTRAINT FK_endereco_2
    FOREIGN KEY (fk_usuario_id)
    REFERENCES usuario (id)
    ON DELETE CASCADE;
 
ALTER TABLE produto ADD CONSTRAINT FK_produto_2
    FOREIGN KEY (fk_categoria_id)
    REFERENCES categoria (id)
    ON DELETE CASCADE;
 
ALTER TABLE pedido ADD CONSTRAINT FK_pedido_2
    FOREIGN KEY (fk_metodoPagamento_id)
    REFERENCES metodoPagamento (id)
    ON DELETE CASCADE;
 
ALTER TABLE pedido ADD CONSTRAINT FK_pedido_3
    FOREIGN KEY (fk_usuario_id)
    REFERENCES usuario (id)
    ON DELETE CASCADE;
 
ALTER TABLE pedido ADD CONSTRAINT FK_pedido_4
    FOREIGN KEY (fk_metodoEntrega_id)
    REFERENCES metodoEntrega (id)
    ON DELETE CASCADE;
 
ALTER TABLE pedido ADD CONSTRAINT FK_pedido_5
    FOREIGN KEY (fk_endereco_id)
    REFERENCES endereco (id);
 
ALTER TABLE pedido ADD CONSTRAINT FK_pedido_6
    FOREIGN KEY (fk_entregador_id)
    REFERENCES usuario (id);
 
ALTER TABLE atualizacaoPedido ADD CONSTRAINT FK_atualizacaoPedido_2
    FOREIGN KEY (fk_pedido_id)
    REFERENCES pedido (id)
    ON DELETE CASCADE;
 
ALTER TABLE atualizacaoPedido ADD CONSTRAINT FK_atualizacaoPedido_3
    FOREIGN KEY (fk_usuario_id)
    REFERENCES usuario (id);
 
ALTER TABLE avaliacaoProduto ADD CONSTRAINT FK_avaliacaoProduto_2
    FOREIGN KEY (fk_produto_id)
    REFERENCES produto (id)
    ON DELETE CASCADE;
 
ALTER TABLE avaliacaoProduto ADD CONSTRAINT FK_avaliacaoProduto_3
    FOREIGN KEY (fk_usuario_id)
    REFERENCES usuario (id);
 
ALTER TABLE produtoPedido ADD CONSTRAINT FK_produtoPedido_2
    FOREIGN KEY (fk_produto_id)
    REFERENCES produto (id)
    ON DELETE CASCADE;
 
ALTER TABLE produtoPedido ADD CONSTRAINT FK_produtoPedido_3
    FOREIGN KEY (fk_pedido_id)
    REFERENCES pedido (id)
    ON DELETE CASCADE;
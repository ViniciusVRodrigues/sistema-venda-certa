import { body } from 'express-validator';

export const usuarioValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome deve ter no máximo 100 caracteres'),
  
  body('email')
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email deve ser válido')
    .isLength({ max: 150 })
    .withMessage('Email deve ter no máximo 150 caracteres'),
  
  body('cargo')
    .notEmpty()
    .withMessage('Cargo é obrigatório')
    .isIn(['customer', 'admin', 'delivery'])
    .withMessage('Cargo deve ser customer, admin ou delivery')
    .isLength({ max: 50 })
    .withMessage('Cargo deve ter no máximo 50 caracteres'),
  
  body('numeroCelular')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Número de celular deve ter no máximo 20 caracteres'),
  
  body('status')
    .optional()
    .isInt({ min: 0, max: 255 })
    .withMessage('Status deve ser um número entre 0 e 255'),
  
  body('totalPedidos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total de pedidos deve ser um número inteiro positivo'),
  
  body('totalGasto')
    .optional()
    .isFloat({ min: 0, max: 99999999.99 })
    .withMessage('Total gasto deve ser um número entre 0 e 99999999.99'),
  
  body('entregasFeitas')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Entregas feitas deve ser um número inteiro positivo'),
  
  body('nota')
    .optional()
    .isFloat({ min: 0.0, max: 9.9 })
    .withMessage('Nota deve ser um número entre 0.0 e 9.9'),
];

export const usuarioUpdateValidation = [
  body('nome')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Nome deve ter no máximo 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email deve ser válido')
    .isLength({ max: 150 })
    .withMessage('Email deve ter no máximo 150 caracteres'),
  
  body('cargo')
    .optional()
    .isIn(['customer', 'admin', 'delivery'])
    .withMessage('Cargo deve ser customer, admin ou delivery')
    .isLength({ max: 50 })
    .withMessage('Cargo deve ter no máximo 50 caracteres'),
  
  body('numeroCelular')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Número de celular deve ter no máximo 20 caracteres'),
  
  body('status')
    .optional()
    .isInt({ min: 0, max: 255 })
    .withMessage('Status deve ser um número entre 0 e 255'),
  
  body('totalPedidos')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total de pedidos deve ser um número inteiro positivo'),
  
  body('totalGasto')
    .optional()
    .isFloat({ min: 0, max: 99999999.99 })
    .withMessage('Total gasto deve ser um número entre 0 e 99999999.99'),
  
  body('entregasFeitas')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Entregas feitas deve ser um número inteiro positivo'),
  
  body('nota')
    .optional()
    .isFloat({ min: 0.0, max: 9.9 })
    .withMessage('Nota deve ser um número entre 0.0 e 9.9'),
];

export const enderecoValidation = [
  body('rua')
    .notEmpty()
    .withMessage('Rua é obrigatória')
    .isLength({ max: 100 })
    .withMessage('Rua deve ter no máximo 100 caracteres'),
  
  body('numero')
    .notEmpty()
    .withMessage('Número é obrigatório')
    .isLength({ max: 10 })
    .withMessage('Número deve ter no máximo 10 caracteres'),
  
  body('complemento')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Complemento deve ter no máximo 50 caracteres'),
  
  body('bairro')
    .notEmpty()
    .withMessage('Bairro é obrigatório')
    .isLength({ max: 50 })
    .withMessage('Bairro deve ter no máximo 50 caracteres'),
  
  body('cidade')
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ max: 50 })
    .withMessage('Cidade deve ter no máximo 50 caracteres'),
  
  body('estado')
    .notEmpty()
    .withMessage('Estado é obrigatório')
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres'),
  
  body('cep')
    .notEmpty()
    .withMessage('CEP é obrigatório')
    .isLength({ max: 10 })
    .withMessage('CEP deve ter no máximo 10 caracteres'),
  
  body('favorito')
    .optional()
    .isBoolean()
    .withMessage('Favorito deve ser um valor booleano'),
  
  body('fk_usuario_id')
    .isInt({ min: 1 })
    .withMessage('ID do usuário deve ser um número inteiro positivo'),
];

export const categoriaValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 50 })
    .withMessage('Nome deve ter no máximo 50 caracteres'),
  
  body('descricao')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Descrição deve ter no máximo 255 caracteres'),
  
  body('estaAtiva')
    .optional()
    .isBoolean()
    .withMessage('Está ativa deve ser um valor booleano'),
];

export const produtoValidation = [
  body('sku')
    .optional()
    .isLength({ max: 30 })
    .withMessage('SKU deve ter no máximo 30 caracteres'),
  
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Nome deve ter no máximo 100 caracteres'),
  
  body('descricao')
    .optional()
    .isString()
    .withMessage('Descrição deve ser um texto'),
  
  body('descricaoResumida')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Descrição resumida deve ter no máximo 255 caracteres'),
  
  body('preco')
    .notEmpty()
    .withMessage('Preço é obrigatório')
    .isFloat({ min: 0.00, max: 99999999.99 })
    .withMessage('Preço deve ser um número entre 0.00 e 99999999.99'),
  
  body('medida')
    .notEmpty()
    .withMessage('Medida é obrigatória')
    .isLength({ max: 20 })
    .withMessage('Medida deve ter no máximo 20 caracteres'),
  
  body('estoque')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo'),
  
  body('status')
    .optional()
    .isInt({ min: 0, max: 255 })
    .withMessage('Status deve ser um número entre 0 e 255'),
  
  body('tags')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Tags devem ter no máximo 255 caracteres'),
  
  body('fk_categoria_id')
    .notEmpty()
    .withMessage('Categoria é obrigatória')
    .isInt({ min: 1 })
    .withMessage('ID da categoria deve ser um número inteiro positivo'),
];

export const produtoUpdateValidation = [
  body('sku')
    .optional()
    .isLength({ max: 30 })
    .withMessage('SKU deve ter no máximo 30 caracteres'),
  
  body('nome')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Nome deve ter no máximo 100 caracteres'),
  
  body('descricao')
    .optional()
    .isString()
    .withMessage('Descrição deve ser um texto'),
  
  body('descricaoResumida')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Descrição resumida deve ter no máximo 255 caracteres'),
  
  body('preco')
    .optional()
    .isFloat({ min: 0.00, max: 99999999.99 })
    .withMessage('Preço deve ser um número entre 0.00 e 99999999.99'),
  
  body('medida')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Medida deve ter no máximo 20 caracteres'),
  
  body('estoque')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo'),
  
  body('status')
    .optional()
    .isInt({ min: 0, max: 255 })
    .withMessage('Status deve ser um número entre 0 e 255'),
  
  body('tags')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Tags devem ter no máximo 255 caracteres'),
  
  body('fk_categoria_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID da categoria deve ser um número inteiro positivo'),
];

export const pedidoValidation = [
  body('status')
    .isInt({ min: 0, max: 255 })
    .withMessage('Status deve ser um número entre 0 e 255'),
  
  body('total')
    .isFloat({ min: 0.00, max: 99999999.99 })
    .withMessage('Total deve ser um número entre 0.00 e 99999999.99'),
  
  body('subtotal')
    .isFloat({ min: 0.00, max: 99999999.99 })
    .withMessage('Subtotal deve ser um número entre 0.00 e 99999999.99'),
  
  body('taxaEntrega')
    .isFloat({ min: 0.00, max: 99999999.99 })
    .withMessage('Taxa de entrega deve ser um número entre 0.00 e 99999999.99'),
  
  body('statusPagamento')
    .isInt({ min: 0, max: 255 })
    .withMessage('Status de pagamento deve ser um número entre 0 e 255'),
  
  body('anotacoes')
    .optional()
    .isString()
    .withMessage('Anotações devem ser um texto'),
  
  body('motivoCancelamento')
    .optional()
    .isString()
    .withMessage('Motivo de cancelamento deve ser um texto'),
  
  body('estimativaEntrega')
    .optional()
    .isISO8601()
    .withMessage('Estimativa de entrega deve ser uma data válida'),
  
  body('dataEntrega')
    .optional()
    .isISO8601()
    .withMessage('Data de entrega deve ser uma data válida'),
  
  body('fk_entregador_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID do entregador deve ser um número inteiro positivo'),
  
  body('fk_metodoPagamento_id')
    .isInt({ min: 1 })
    .withMessage('ID do método de pagamento deve ser um número inteiro positivo'),
  
  body('fk_usuario_id')
    .isInt({ min: 1 })
    .withMessage('ID do usuário deve ser um número inteiro positivo'),
  
  body('fk_metodoEntrega_id')
    .isInt({ min: 1 })
    .withMessage('ID do método de entrega deve ser um número inteiro positivo'),
  
  body('fk_endereco_id')
    .isInt({ min: 1 })
    .withMessage('ID do endereço deve ser um número inteiro positivo'),
];

export const metodoEntregaValidation = [
  body('descricao')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Descrição deve ter no máximo 255 caracteres'),
  
  body('tipo')
    .notEmpty()
    .withMessage('Tipo é obrigatório')
    .isLength({ max: 30 })
    .withMessage('Tipo deve ter no máximo 30 caracteres'),
  
  body('estimativaEntrega')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Estimativa de entrega deve ter no máximo 50 caracteres'),
  
  body('status')
    .isInt({ min: 0, max: 255 })
    .withMessage('Status deve ser um número entre 0 e 255'),
  
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 50 })
    .withMessage('Nome deve ter no máximo 50 caracteres'),
  
  body('preco')
    .isFloat({ min: 0.00, max: 99999999.99 })
    .withMessage('Preço deve ser um número entre 0.00 e 99999999.99'),
];

export const metodoPagamentoValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ max: 50 })
    .withMessage('Nome deve ter no máximo 50 caracteres'),
  
  body('tipo')
    .notEmpty()
    .withMessage('Tipo é obrigatório')
    .isLength({ max: 20 })
    .withMessage('Tipo deve ter no máximo 20 caracteres'),
  
  body('ativo')
    .optional()
    .isInt({ min: 0, max: 255 })
    .withMessage('Ativo deve ser um número entre 0 e 255'),
];
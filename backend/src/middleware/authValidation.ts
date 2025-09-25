import { body, ValidationChain } from 'express-validator';

// Validações para login
export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email é obrigatório'),
  
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Validações para registro
export const validateRegister: ValidationChain[] = [
  body('nome')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),
  
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage('Email deve ter no máximo 150 caracteres')
    .notEmpty()
    .withMessage('Email é obrigatório'),
  
  body('senha')
    .isLength({ min: 6, max: 255 })
    .withMessage('Senha deve ter entre 6 e 255 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  
  body('cargo')
    .isIn(['cliente', 'admin', 'entregador', 'administrador'])
    .withMessage('Cargo deve ser: cliente, admin, entregador ou administrador')
    .notEmpty()
    .withMessage('Cargo é obrigatório'),
  
  body('numeroCelular')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Número de celular deve ter no máximo 20 caracteres')
    .matches(/^[\d\s\(\)\-\+]+$/)
    .withMessage('Número de celular deve conter apenas números, espaços, parênteses, hífens ou sinal de mais')
];

// Validações para mudança de senha
export const validateChangePassword: ValidationChain[] = [
  body('senhaAtual')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),
  
  body('novaSenha')
    .isLength({ min: 6, max: 255 })
    .withMessage('Nova senha deve ter entre 6 e 255 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número')
    .notEmpty()
    .withMessage('Nova senha é obrigatória'),
  
  body('confirmarSenha')
    .notEmpty()
    .withMessage('Confirmação de senha é obrigatória')
    .custom((value, { req }) => {
      if (value !== req.body.novaSenha) {
        throw new Error('Confirmação de senha não confere com a nova senha');
      }
      return true;
    })
];

// Validações para recuperação de senha
export const validateForgotPassword: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email é obrigatório')
];

// Validações para redefinir senha
export const validateResetPassword: ValidationChain[] = [
  body('token')
    .notEmpty()
    .withMessage('Token é obrigatório'),
  
  body('novaSenha')
    .isLength({ min: 6, max: 255 })
    .withMessage('Nova senha deve ter entre 6 e 255 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número')
    .notEmpty()
    .withMessage('Nova senha é obrigatória'),
  
  body('confirmarSenha')
    .notEmpty()
    .withMessage('Confirmação de senha é obrigatória')
    .custom((value, { req }) => {
      if (value !== req.body.novaSenha) {
        throw new Error('Confirmação de senha não confere com a nova senha');
      }
      return true;
    })
];

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { body } from 'express-validator';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login do usuário
 *     description: Autentica um usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@vendacerta.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
], AuthController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Registro de novo usuário
 *     description: Cria uma nova conta de usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: senha123
 *               cargo:
 *                 type: string
 *                 enum: [cliente, admin, entregador]
 *                 example: cliente
 *               numeroCelular:
 *                 type: string
 *                 example: (11) 99999-9999
 *     responses:
 *       200:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuário registrado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *       409:
 *         description: Email já está em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', [
  body('nome')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Email deve ter um formato válido')
    .normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('cargo')
    .isIn(['cliente', 'admin', 'entregador', 'administrador'])
    .withMessage('Cargo deve ser: cliente, admin, entregador ou administrador'),
  body('numeroCelular')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Número de celular inválido')
], AuthController.register);

/**
 * @swagger
 * /api/auth/verify-token:
 *   post:
 *     tags: [Authentication]
 *     summary: Verificar token JWT
 *     description: Verifica se um token JWT é válido e retorna informações do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                     usuario:
 *                       $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/verify-token', AuthController.verifyToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout do usuário
 *     description: Realiza logout (cliente deve remover token do storage)
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout realizado com sucesso
 */
router.post('/logout', AuthController.logout);

export default router;

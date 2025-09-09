import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { pedidoValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Filtrar por status do pedido
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: entregador_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do entregador
 *     responses:
 *       200:
 *         description: Lista de pedidos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', asyncHandler(PedidoController.getAll));

/**
 * @swagger
 * /api/pedidos/calculate-delivery:
 *   post:
 *     summary: Calcula taxa e tempo de entrega usando Strategy Pattern
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - distance
 *               - weight
 *               - method
 *             properties:
 *               distance:
 *                 type: number
 *                 description: Distância em km
 *               weight:
 *                 type: number
 *                 description: Peso em kg
 *               method:
 *                 type: string
 *                 enum: [motorcycle, car, pickup]
 *               urgency:
 *                 type: string
 *                 enum: [normal, express, scheduled]
 *                 default: normal
 *     responses:
 *       200:
 *         description: Cálculo realizado com sucesso
 *       400:
 *         description: Parâmetros inválidos
 */
router.post('/calculate-delivery', asyncHandler(PedidoController.calculateDelivery));

/**
 * @swagger
 * /api/pedidos/process-payment:
 *   post:
 *     summary: Processa pagamento usando Strategy Pattern
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - method
 *               - paymentData
 *             properties:
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [credit_card, pix, cash]
 *               paymentData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Pagamento processado
 *       400:
 *         description: Dados inválidos
 */
router.post('/process-payment', asyncHandler(PedidoController.processPayment));

/**
 * @swagger
 * /api/pedidos/report:
 *   get:
 *     summary: Gera relatório de pedidos usando Template Method
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 */
router.get('/report', asyncHandler(PedidoController.generateReport));

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', asyncHandler(PedidoController.getById));

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - total
 *               - subtotal
 *               - taxaEntrega
 *               - statusPagamento
 *               - fk_metodoPagamento_id
 *               - fk_usuario_id
 *               - fk_metodoEntrega_id
 *               - fk_endereco_id
 *             properties:
 *               status:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 255
 *               total:
 *                 type: number
 *                 format: decimal
 *               subtotal:
 *                 type: number
 *                 format: decimal
 *               taxaEntrega:
 *                 type: number
 *                 format: decimal
 *               statusPagamento:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 255
 *               anotacoes:
 *                 type: string
 *               estimativaEntrega:
 *                 type: string
 *                 format: date-time
 *               fk_entregador_id:
 *                 type: integer
 *               fk_metodoPagamento_id:
 *                 type: integer
 *               fk_usuario_id:
 *                 type: integer
 *               fk_metodoEntrega_id:
 *                 type: integer
 *               fk_endereco_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', pedidoValidation, asyncHandler(PedidoController.create));

/**
 * @swagger
 * /api/pedidos/{id}/status:
 *   put:
 *     summary: Atualiza status do pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 6
 *               observacao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id/status', asyncHandler(PedidoController.updateStatus));

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', pedidoValidation, asyncHandler(PedidoController.update));

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido removido com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', asyncHandler(PedidoController.delete));

/**
 * @swagger
 * /api/pedidos/{id}/status:
 *   put:
 *     summary: Atualiza apenas o status do pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 255
 *                 description: Novo status do pedido
 *               descricao:
 *                 type: string
 *                 description: Descrição da mudança de status
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id/status', asyncHandler(PedidoController.updateStatus));

// GET /api/pedidos/usuario/:usuarioId
router.get('/usuario/:usuarioId', asyncHandler(PedidoController.getByUsuario));

export default router;
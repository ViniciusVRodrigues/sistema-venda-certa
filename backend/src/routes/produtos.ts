import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { produtoValidation } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por categoria
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Filtrar por status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou descrição
 *     responses:
 *       200:
 *         description: Lista de produtos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', asyncHandler(ProdutoController.getAll));

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', asyncHandler(ProdutoController.getById));

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - medida
 *               - estoque
 *               - status
 *               - fk_categoria_id
 *             properties:
 *               sku:
 *                 type: string
 *                 maxLength: 30
 *               nome:
 *                 type: string
 *                 maxLength: 100
 *               descricao:
 *                 type: string
 *               descricaoResumida:
 *                 type: string
 *                 maxLength: 255
 *               preco:
 *                 type: number
 *                 format: decimal
 *               medida:
 *                 type: string
 *                 maxLength: 20
 *               estoque:
 *                 type: integer
 *               status:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 255
 *               tags:
 *                 type: string
 *                 maxLength: 255
 *               fk_categoria_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', produtoValidation, asyncHandler(ProdutoController.create));

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *                 maxLength: 30
 *               nome:
 *                 type: string
 *                 maxLength: 100
 *               descricao:
 *                 type: string
 *               descricaoResumida:
 *                 type: string
 *                 maxLength: 255
 *               preco:
 *                 type: number
 *                 format: decimal
 *               medida:
 *                 type: string
 *                 maxLength: 20
 *               estoque:
 *                 type: integer
 *               status:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 255
 *               tags:
 *                 type: string
 *                 maxLength: 255
 *               fk_categoria_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', produtoValidation, asyncHandler(ProdutoController.update));

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto removido com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', asyncHandler(ProdutoController.delete));

/**
 * @swagger
 * /api/produtos/categoria/{categoriaId}:
 *   get:
 *     summary: Lista produtos por categoria
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: categoriaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Produtos da categoria recuperados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/categoria/:categoriaId', asyncHandler(ProdutoController.getByCategoria));

/**
 * @swagger
 * /api/produtos/{id}/avaliacoes:
 *   get:
 *     summary: Lista avaliações de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Avaliações do produto recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   avaliacao:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                   comentario:
 *                     type: string
 *                   fk_produto_id:
 *                     type: integer
 *                   fk_usuario_id:
 *                     type: integer
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id/avaliacoes', asyncHandler(ProdutoController.getAvaliacoes));

export default router;
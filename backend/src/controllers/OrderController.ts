import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Joi from 'joi';
import { Order, OrderStatus, PaymentMethod } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import Cliente from '../models/Cliente';

// Validation schemas
const orderItemSchema = Joi.object({
  produtoId: Joi.number().integer().positive().required(),
  quantidade: Joi.number().integer().min(1).required(),
  observacoes: Joi.string().optional()
});

const createOrderSchema = Joi.object({
  clienteId: Joi.number().integer().positive().required(),
  metodoPagamento: Joi.string().valid(...Object.values(PaymentMethod)).required(),
  itens: Joi.array().items(orderItemSchema).min(1).required(),
  desconto: Joi.number().min(0).optional(),
  taxaEntrega: Joi.number().min(0).optional(),
  observacoes: Joi.string().optional(),
  enderecoEntrega: Joi.string().optional(),
  telefoneContato: Joi.string().optional()
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid(...Object.values(OrderStatus)).optional(),
  metodoPagamento: Joi.string().valid(...Object.values(PaymentMethod)).optional(),
  observacoes: Joi.string().optional(),
  enderecoEntrega: Joi.string().optional(),
  telefoneContato: Joi.string().optional(),
  dataEntrega: Joi.date().optional(),
  motivoCancelamento: Joi.string().when('status', {
    is: OrderStatus.CANCELADO,
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

export class OrderController {
  // Generate unique order number
  private static generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    
    return `${year}${month}${day}${timestamp}`;
  }

  // GET /api/pedidos
  static async list(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '10',
        search = '',
        clienteId = '',
        status = '',
        metodoPagamento = '',
        dateFrom = '',
        dateTo = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build where conditions
      const whereConditions: any = {};

      if (search) {
        whereConditions[Op.or] = [
          { numeroComanda: { [Op.like]: `%${search}%` } },
          { observacoes: { [Op.like]: `%${search}%` } }
        ];
      }

      if (clienteId) {
        whereConditions.clienteId = parseInt(clienteId as string);
      }

      if (status) {
        whereConditions.status = status;
      }

      if (metodoPagamento) {
        whereConditions.metodoPagamento = metodoPagamento;
      }

      if (dateFrom && dateTo) {
        whereConditions.createdAt = {
          [Op.between]: [new Date(dateFrom as string), new Date(dateTo as string)]
        };
      } else if (dateFrom) {
        whereConditions.createdAt = {
          [Op.gte]: new Date(dateFrom as string)
        };
      } else if (dateTo) {
        whereConditions.createdAt = {
          [Op.lte]: new Date(dateTo as string)
        };
      }

      const { count, rows } = await Order.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome', 'email', 'telefone']
          },
          {
            model: OrderItem,
            as: 'itens',
            include: [
              {
                model: Product,
                as: 'produto',
                attributes: ['id', 'nome', 'imagemPrincipal']
              }
            ]
          }
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: limitNum,
        offset
      });

      const totalPages = Math.ceil(count / limitNum);

      res.status(200).json({
        success: true,
        message: 'Pedidos obtidos com sucesso',
        data: rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: count,
          itemsPerPage: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      });

    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/pedidos/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const order = await Order.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome', 'email', 'telefone']
          },
          {
            model: OrderItem,
            as: 'itens',
            include: [
              {
                model: Product,
                as: 'produto',
                attributes: ['id', 'nome', 'imagemPrincipal', 'estoque']
              }
            ]
          }
        ]
      });
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Pedido obtido com sucesso',
        data: order
      });

    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // POST /api/pedidos
  static async create(req: Request, res: Response) {
    try {
      // Validate input
      const { error, value } = createOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { clienteId, metodoPagamento, itens, desconto = 0, taxaEntrega = 0, ...orderData } = value;

      // Verify client exists
      const cliente = await Cliente.findByPk(clienteId);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Verify products and calculate total
      let subtotal = 0;
      const orderItems = [];

      for (const item of itens) {
        const product = await Product.findByPk(item.produtoId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Produto com ID ${item.produtoId} não encontrado`
          });
        }

        if (!product.ativo) {
          return res.status(400).json({
            success: false,
            message: `Produto "${product.nome}" não está ativo`
          });
        }

        if (product.estoque < item.quantidade) {
          return res.status(400).json({
            success: false,
            message: `Estoque insuficiente para o produto "${product.nome}". Disponível: ${product.estoque}`
          });
        }

        const price = product.precoPromocional || product.preco;
        const itemSubtotal = price * item.quantidade;
        subtotal += itemSubtotal;

        orderItems.push({
          produtoId: product.id,
          nomeProduto: product.nome,
          precoProduto: price,
          quantidade: item.quantidade,
          subtotal: itemSubtotal,
          observacoes: item.observacoes
        });
      }

      const total = subtotal - desconto + taxaEntrega;

      // Create order
      const numeroComanda = this.generateOrderNumber();

      const order = await Order.create({
        clienteId,
        numeroComanda,
        metodoPagamento,
        subtotal,
        desconto,
        taxaEntrega,
        total,
        status: OrderStatus.PENDENTE,
        ...orderData
      });

      // Create order items and update product stock
      for (let i = 0; i < orderItems.length; i++) {
        const itemData = orderItems[i];
        const productId = itens[i].produtoId;

        await OrderItem.create({
          pedidoId: order.id,
          ...itemData
        });

        // Update product stock
        await Product.decrement('estoque', {
          by: itemData.quantidade,
          where: { id: productId }
        });

        // Update product total sales
        await Product.increment(['totalVendas'], {
          by: itemData.quantidade,
          where: { id: productId }
        });
      }

      // Update client statistics
      await Cliente.increment(['totalPedidos'], {
        by: 1,
        where: { id: clienteId }
      });

      await Cliente.increment(['totalGasto'], {
        by: total,
        where: { id: clienteId }
      });

      await Cliente.update(
        { ultimoPedidoData: new Date() },
        { where: { id: clienteId } }
      );

      // Fetch complete order data
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome', 'email', 'telefone']
          },
          {
            model: OrderItem,
            as: 'itens',
            include: [
              {
                model: Product,
                as: 'produto',
                attributes: ['id', 'nome', 'imagemPrincipal']
              }
            ]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: completeOrder
      });

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // PUT /api/pedidos/:id
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Validate input
      const { error, value } = updateOrderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Handle status changes
      if (value.status && value.status !== order.status) {
        const now = new Date();

        if (value.status === OrderStatus.CONFIRMADO) {
          value.dataConfirmacao = now;
        } else if (value.status === OrderStatus.ENTREGUE) {
          value.dataEntrega = now;
        } else if (value.status === OrderStatus.CANCELADO) {
          value.dataCancelamento = now;
          
          // Restore product stock when order is cancelled
          const orderItems = await OrderItem.findAll({
            where: { pedidoId: id }
          });

          for (const item of orderItems) {
            await Product.increment('estoque', {
              by: item.quantidade,
              where: { id: item.produtoId }
            });

            await Product.decrement('totalVendas', {
              by: item.quantidade,
              where: { id: item.produtoId }
            });
          }

          // Update client statistics
          await Cliente.decrement(['totalPedidos'], {
            by: 1,
            where: { id: order.clienteId }
          });

          await Cliente.decrement(['totalGasto'], {
            by: order.total,
            where: { id: order.clienteId }
          });
        }
      }

      await order.update(value);

      // Fetch updated order with includes
      const updatedOrder = await Order.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente',
            attributes: ['id', 'nome', 'email', 'telefone']
          },
          {
            model: OrderItem,
            as: 'itens',
            include: [
              {
                model: Product,
                as: 'produto',
                attributes: ['id', 'nome', 'imagemPrincipal']
              }
            ]
          }
        ]
      });

      res.status(200).json({
        success: true,
        message: 'Pedido atualizado com sucesso',
        data: updatedOrder
      });

    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // DELETE /api/pedidos/:id
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Only allow deletion of pending or cancelled orders
      if (![OrderStatus.PENDENTE, OrderStatus.CANCELADO].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Apenas pedidos pendentes ou cancelados podem ser excluídos'
        });
      }

      // If order is pending, restore stock
      if (order.status === OrderStatus.PENDENTE) {
        const orderItems = await OrderItem.findAll({
          where: { pedidoId: id }
        });

        for (const item of orderItems) {
          await Product.increment('estoque', {
            by: item.quantidade,
            where: { id: item.produtoId }
          });

          await Product.decrement('totalVendas', {
            by: item.quantidade,
            where: { id: item.produtoId }
          });
        }

        // Update client statistics
        await Cliente.decrement(['totalPedidos'], {
          by: 1,
          where: { id: order.clienteId }
        });

        await Cliente.decrement(['totalGasto'], {
          by: order.total,
          where: { id: order.clienteId }
        });
      }

      await order.destroy();

      res.status(200).json({
        success: true,
        message: 'Pedido excluído com sucesso'
      });

    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/pedidos/stats
  static async getStats(req: Request, res: Response) {
    try {
      const {
        dateFrom = '',
        dateTo = ''
      } = req.query;

      const whereConditions: any = {};

      if (dateFrom && dateTo) {
        whereConditions.createdAt = {
          [Op.between]: [new Date(dateFrom as string), new Date(dateTo as string)]
        };
      }

      const totalOrders = await Order.count({ where: whereConditions });
      const pendingOrders = await Order.count({ 
        where: { ...whereConditions, status: OrderStatus.PENDENTE } 
      });
      const completedOrders = await Order.count({ 
        where: { ...whereConditions, status: OrderStatus.ENTREGUE } 
      });
      const cancelledOrders = await Order.count({ 
        where: { ...whereConditions, status: OrderStatus.CANCELADO } 
      });

      const totalRevenue = await Order.sum('total', { 
        where: { 
          ...whereConditions, 
          status: { [Op.notIn]: [OrderStatus.CANCELADO] } 
        } 
      }) || 0;

      const avgOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledOrders) : 0;

      res.status(200).json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          totalOrders,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
          avgOrderValue: Math.round(avgOrderValue * 100) / 100
        }
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
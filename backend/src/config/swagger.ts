import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema Venda Certa API',
      version: '1.0.0',
      description: 'API para Sistema de Venda Certa - plataforma de e-commerce com gestão de produtos, pedidos, usuários e entregas',
      contact: {
        name: 'Sistema Venda Certa',
        email: 'contato@vendacerta.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nome', 'email', 'cargo'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário'
            },
            nome: {
              type: 'string',
              maxLength: 100,
              description: 'Nome completo do usuário'
            },
            email: {
              type: 'string',
              maxLength: 150,
              description: 'Email único do usuário'
            },
            cargo: {
              type: 'string',
              maxLength: 50,
              enum: ['customer', 'admin', 'delivery'],
              description: 'Cargo/função do usuário'
            },
            numeroCelular: {
              type: 'string',
              maxLength: 20,
              description: 'Número de celular'
            },
            status: {
              type: 'integer',
              minimum: 0,
              maximum: 255,
              description: 'Status do usuário (TINYINT)'
            },
            totalPedidos: {
              type: 'integer',
              description: 'Total de pedidos realizados'
            },
            totalGasto: {
              type: 'number',
              format: 'decimal',
              description: 'Total gasto pelo usuário'
            },
            entregasFeitas: {
              type: 'integer',
              description: 'Número de entregas realizadas (para entregadores)'
            },
            nota: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              maximum: 9.9,
              description: 'Nota/avaliação do usuário'
            }
          }
        },
        Endereco: {
          type: 'object',
          required: ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep', 'fk_usuario_id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do endereço'
            },
            rua: {
              type: 'string',
              maxLength: 100,
              description: 'Nome da rua'
            },
            numero: {
              type: 'string',
              maxLength: 10,
              description: 'Número da residência'
            },
            complemento: {
              type: 'string',
              maxLength: 50,
              description: 'Complemento do endereço'
            },
            bairro: {
              type: 'string',
              maxLength: 50,
              description: 'Nome do bairro'
            },
            cidade: {
              type: 'string',
              maxLength: 50,
              description: 'Nome da cidade'
            },
            estado: {
              type: 'string',
              maxLength: 2,
              description: 'Sigla do estado (UF)'
            },
            cep: {
              type: 'string',
              maxLength: 10,
              description: 'Código postal'
            },
            favorito: {
              type: 'boolean',
              description: 'Se é o endereço favorito/padrão'
            },
            fk_usuario_id: {
              type: 'integer',
              description: 'ID do usuário proprietário'
            }
          }
        },
        Produto: {
          type: 'object',
          required: ['nome', 'preco', 'medida', 'estoque', 'status', 'fk_categoria_id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto'
            },
            sku: {
              type: 'string',
              maxLength: 30,
              description: 'Código SKU único do produto'
            },
            nome: {
              type: 'string',
              maxLength: 100,
              description: 'Nome do produto'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada do produto'
            },
            descricaoResumida: {
              type: 'string',
              maxLength: 255,
              description: 'Descrição resumida do produto'
            },
            preco: {
              type: 'number',
              format: 'decimal',
              description: 'Preço do produto'
            },
            medida: {
              type: 'string',
              maxLength: 20,
              description: 'Unidade de medida'
            },
            estoque: {
              type: 'integer',
              description: 'Quantidade em estoque'
            },
            status: {
              type: 'integer',
              minimum: 0,
              maximum: 255,
              description: 'Status do produto (TINYINT)'
            },
            tags: {
              type: 'string',
              maxLength: 255,
              description: 'Tags do produto separadas por vírgula'
            },
            fk_categoria_id: {
              type: 'integer',
              description: 'ID da categoria do produto'
            }
          }
        },
        Categoria: {
          type: 'object',
          required: ['nome', 'estaAtiva'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da categoria'
            },
            nome: {
              type: 'string',
              maxLength: 50,
              description: 'Nome da categoria'
            },
            descricao: {
              type: 'string',
              maxLength: 255,
              description: 'Descrição da categoria'
            },
            estaAtiva: {
              type: 'boolean',
              description: 'Se a categoria está ativa'
            }
          }
        },
        Pedido: {
          type: 'object',
          required: ['status', 'total', 'subtotal', 'taxaEntrega', 'statusPagamento', 'fk_metodoPagamento_id', 'fk_usuario_id', 'fk_metodoEntrega_id', 'fk_endereco_id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do pedido'
            },
            status: {
              type: 'integer',
              minimum: 0,
              maximum: 255,
              description: 'Status do pedido (TINYINT)'
            },
            total: {
              type: 'number',
              format: 'decimal',
              description: 'Valor total do pedido'
            },
            subtotal: {
              type: 'number',
              format: 'decimal',
              description: 'Subtotal do pedido'
            },
            taxaEntrega: {
              type: 'number',
              format: 'decimal',
              description: 'Taxa de entrega'
            },
            statusPagamento: {
              type: 'integer',
              minimum: 0,
              maximum: 255,
              description: 'Status do pagamento (TINYINT)'
            },
            anotacoes: {
              type: 'string',
              description: 'Observações do pedido'
            },
            motivoCancelamento: {
              type: 'string',
              description: 'Motivo do cancelamento (se aplicável)'
            },
            estimativaEntrega: {
              type: 'string',
              format: 'date-time',
              description: 'Data estimada de entrega'
            },
            dataEntrega: {
              type: 'string',
              format: 'date-time',
              description: 'Data efetiva de entrega'
            },
            fk_entregador_id: {
              type: 'integer',
              description: 'ID do entregador responsável'
            },
            fk_metodoPagamento_id: {
              type: 'integer',
              description: 'ID do método de pagamento'
            },
            fk_usuario_id: {
              type: 'integer',
              description: 'ID do usuário que fez o pedido'
            },
            fk_metodoEntrega_id: {
              type: 'integer',
              description: 'ID do método de entrega'
            },
            fk_endereco_id: {
              type: 'integer',
              description: 'ID do endereço de entrega'
            }
          }
        },
        MetodoEntrega: {
          type: 'object',
          required: ['tipo', 'status', 'nome', 'preco'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do método de entrega'
            },
            descricao: {
              type: 'string',
              maxLength: 255,
              description: 'Descrição do método'
            },
            tipo: {
              type: 'string',
              maxLength: 30,
              description: 'Tipo de entrega'
            },
            estimativaEntrega: {
              type: 'string',
              maxLength: 50,
              description: 'Estimativa de entrega'
            },
            status: {
              type: 'integer',
              minimum: 0,
              maximum: 255,
              description: 'Status do método (TINYINT)'
            },
            nome: {
              type: 'string',
              maxLength: 50,
              description: 'Nome do método'
            },
            preco: {
              type: 'number',
              format: 'decimal',
              description: 'Preço da entrega'
            }
          }
        },
        MetodoPagamento: {
          type: 'object',
          required: ['nome', 'tipo', 'ativo'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do método de pagamento'
            },
            nome: {
              type: 'string',
              maxLength: 50,
              description: 'Nome do método'
            },
            tipo: {
              type: 'string',
              maxLength: 20,
              description: 'Tipo de pagamento'
            },
            ativo: {
              type: 'integer',
              minimum: 0,
              maximum: 255,
              description: 'Se o método está ativo (TINYINT)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            details: {
              type: 'string',
              description: 'Detalhes adicionais do erro'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        BadRequest: {
          description: 'Requisição inválida',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos com documentação das rotas
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
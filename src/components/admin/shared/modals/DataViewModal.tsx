import React from 'react';
import { Modal } from '../../../ui';
import { formatCurrencyBR } from '../../../../utils/format';

interface DataViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>;
}

export const DataViewModal: React.FC<DataViewModalProps> = ({
  isOpen,
  onClose,
  title,
  data
}) => {
  const formatValue = (key: string, value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {value ? '✓ Sim' : '✗ Não'}
          </span>
        </div>
      );
    }

    if (typeof value === 'number') {
      if (key.toLowerCase().includes('preco') || key.toLowerCase().includes('price') || key.toLowerCase().includes('gasto')) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">
            {formatCurrencyBR(value)}
          </span>
        );
      }
      if (key.toLowerCase().includes('status')) {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value === 1 ? '✓ Ativo' : '✗ Inativo'}
          </span>
        );
      }
      return <span className="font-mono text-gray-700 font-medium">{value}</span>;
    }

    if (typeof value === 'string') {
      if (key.toLowerCase().includes('email')) {
        return (
          <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700 underline">
            {value}
          </a>
        );
      }
      if (key.toLowerCase().includes('telefone') || key.toLowerCase().includes('celular')) {
        return (
          <a href={`tel:${value}`} className="font-mono text-gray-700 hover:text-blue-600">
            {value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
          </a>
        );
      }
      if (key.toLowerCase().includes('senha') || key.toLowerCase().includes('password')) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 font-mono">
            🔒 *****
          </span>
        );
      }
      if (key.toLowerCase().includes('tag')) {
        // Tratamento especial para tags
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        if (tags.length > 1) {
          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          );
        }
        // Se for apenas uma tag ou não tiver vírgulas, trata como tag única
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            #{value}
          </span>
        );
      }
      if (value.length > 150) {
        return (
          <div className="space-y-2">
            <p className="text-gray-700 leading-relaxed">{value.substring(0, 150)}...</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(value);
                alert('Texto completo copiado!');
              }}
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              📋 Ver e copiar texto completo
            </button>
          </div>
        );
      }
      return <span className="text-gray-700">{value}</span>;
    }

    if (value instanceof Date) {
      return <span className="font-mono text-purple-600">{value.toLocaleString('pt-BR')}</span>;
    }

    if (value instanceof Uint8Array) {
      if (key.toLowerCase().includes('imagem') || key.toLowerCase().includes('image')) {
        try {
          const base64 = btoa(String.fromCharCode(...value));
          return (
            <div className="flex items-center space-x-3">
              <img 
                src={`data:image/jpeg;base64,${base64}`}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-product.png';
                }}
              />
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500">Tamanho: {value.length} bytes</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(base64);
                    alert('Base64 copiado!');
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 text-left"
                >
                  📋 Copiar base64
                </button>
              </div>
            </div>
          );
        } catch {
          return <span className="text-red-500 text-sm">Erro ao decodificar imagem</span>;
        }
      }
      return <span className="text-gray-600 font-mono text-sm">Binary data ({value.length} bytes)</span>;
    }

    if (typeof value === 'object') {
      // Tratamento especial para objeto categoria
      if (key.toLowerCase().includes('categoria') && value && typeof value === 'object') {
        const categoria = value as { id?: number; nome?: string; descricao?: string; estaAtiva?: boolean };
        if (categoria.nome) {
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ID: {categoria.id}
                </span>
                {categoria.estaAtiva && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Ativa
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{categoria.nome}</div>
                {categoria.descricao && (
                  <div className="text-sm text-gray-600 mt-1">{categoria.descricao}</div>
                )}
              </div>
            </div>
          );
        }
      }
      
      return (
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span>{String(value)}</span>;
  };

  const getFieldLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      id: 'ID',
      nome: 'Nome',
      email: 'E-mail',
      senha: 'Senha',
      cargo: 'Cargo',
      numeroCelular: 'Número Celular',
      status: 'Status',
      totalPedidos: 'Total de Pedidos',
      totalGasto: 'Total Gasto',
      entregasFeitas: 'Entregas Feitas',
      nota: 'Nota',
      sku: 'SKU',
      descricao: 'Descrição',
      descricaoResumida: 'Descrição Resumida',
      preco: 'Preço',
      medida: 'Medida',
      estoque: 'Estoque',
      imagem: 'Imagem',
      tags: 'Tags',
      fk_categoria_id: 'ID da Categoria',
      estaAtiva: 'Está Ativa',
      categoria: 'Informações da Categoria',
      avaliacoes: 'Avaliações'
    };
    
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  interface FieldGroup {
    title: string;
    fields: [string, unknown][];
  }

  const getGroupedFields = (data: Record<string, unknown>): FieldGroup[] => {
    const entries = Object.entries(data);
    
    // Grupos para produtos
    const productGroups = {
      basic: ['id', 'nome', 'sku', 'status'],
      description: ['descricao', 'descricaoResumida', 'tags'],
      pricing: ['preco', 'medida', 'estoque'],
      category: ['categoria'],
      media: ['imagem'],
      relations: ['avaliacoes']
    };

    // Grupos para usuários
    const userGroups = {
      basic: ['id', 'nome', 'email', 'cargo', 'status'],
      contact: ['numeroCelular'],
      stats: ['totalPedidos', 'totalGasto', 'entregasFeitas', 'nota'],
      security: ['senha']
    };

    // Detectar se é produto ou usuário baseado nos campos
    const isProduct = entries.some(([key]) => ['sku', 'preco', 'estoque'].includes(key));
    const isUser = entries.some(([key]) => ['email', 'cargo', 'numeroCelular'].includes(key));

    if (isProduct) {
      return [
        {
          title: 'Informações Básicas',
          fields: entries.filter(([key]) => productGroups.basic.includes(key))
        },
        {
          title: 'Descrição e Tags',
          fields: entries.filter(([key]) => productGroups.description.includes(key))
        },
        {
          title: 'Preço e Estoque',
          fields: entries.filter(([key]) => productGroups.pricing.includes(key))
        },
        {
          title: 'Categoria',
          fields: entries.filter(([key]) => productGroups.category.includes(key))
        },
        {
          title: 'Mídia',
          fields: entries.filter(([key]) => productGroups.media.includes(key))
        },
        {
          title: 'Outros Dados',
          fields: entries.filter(([key]) => !Object.values(productGroups).flat().includes(key))
        }
      ].filter(group => group.fields.length > 0);
    }

    if (isUser) {
      return [
        {
          title: 'Informações Pessoais',
          fields: entries.filter(([key]) => userGroups.basic.includes(key))
        },
        {
          title: 'Contato',
          fields: entries.filter(([key]) => userGroups.contact.includes(key))
        },
        {
          title: 'Estatísticas',
          fields: entries.filter(([key]) => userGroups.stats.includes(key))
        },
        {
          title: 'Segurança',
          fields: entries.filter(([key]) => userGroups.security.includes(key))
        },
        {
          title: 'Outros Dados',
          fields: entries.filter(([key]) => !Object.values(userGroups).flat().includes(key))
        }
      ].filter(group => group.fields.length > 0);
    }

    // Fallback para dados genéricos
    return [
      {
        title: 'Todos os Dados',
        fields: entries
      }
    ];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {getGroupedFields(data).map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">{group.title}</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.fields.map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {getFieldLabel(key)}
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[2.5rem] flex items-center">
                      {formatValue(key, value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-6 border-t mt-6 bg-gray-50 -mx-6 px-6 py-4">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              alert('Dados copiados como JSON!');
            }}
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Copiar JSON</span>
          </button>
          
          <button
            onClick={() => {
              const text = Object.entries(data)
                .map(([key, value]) => `${getFieldLabel(key)}: ${String(value)}`)
                .join('\n');
              navigator.clipboard.writeText(text);
              alert('Dados copiados como texto!');
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Copiar Texto</span>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
};
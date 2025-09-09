// Padrão Template Method - Data Processing
export abstract class DataProcessor {
  // Template method que define o algoritmo de processamento
  public processData(rawData: any): any {
    // 1. Validar dados
    if (!this.validateData(rawData)) {
      throw new Error('Dados inválidos');
    }

    // 2. Normalizar dados
    const normalizedData = this.normalizeData(rawData);

    // 3. Processar dados específicos (implementado pelas subclasses)
    const processedData = this.performSpecificProcessing(normalizedData);

    // 4. Validar resultado
    const validatedResult = this.validateResult(processedData);

    // 5. Formatar resultado final
    return this.formatResult(validatedResult);
  }

  // Hooks implementados na classe base (podem ser sobrescritos)
  protected validateData(data: any): boolean {
    return data !== null && data !== undefined;
  }

  protected normalizeData(data: any): any {
    // Normalização padrão - remover campos nulos
    if (typeof data === 'object' && data !== null) {
      const normalized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
          normalized[key] = value;
        }
      }
      return normalized;
    }
    return data;
  }

  protected validateResult(result: any): any {
    if (!result) {
      throw new Error('Resultado do processamento é inválido');
    }
    return result;
  }

  protected formatResult(result: any): any {
    return {
      processedAt: new Date().toISOString(),
      data: result
    };
  }

  // Método abstrato que deve ser implementado pelas subclasses
  protected abstract performSpecificProcessing(data: any): any;
}

// Implementação concreta para processamento de produtos
export class ProdutoDataProcessor extends DataProcessor {
  protected performSpecificProcessing(data: any): any {
    return {
      ...data,
      preco: parseFloat(data.preco) || 0,
      estoque: parseInt(data.estoque) || 0,
      status: data.status === 'ativo' ? 1 : 0,
      processedBy: 'ProdutoDataProcessor'
    };
  }

  protected validateData(data: any): boolean {
    return super.validateData(data) && 
           data.nome && 
           data.preco !== undefined;
  }
}

// Implementação concreta para processamento de usuários
export class UsuarioDataProcessor extends DataProcessor {
  protected performSpecificProcessing(data: any): any {
    return {
      ...data,
      email: data.email?.toLowerCase(),
      telefone: this.formatPhone(data.telefone),
      processedBy: 'UsuarioDataProcessor'
    };
  }

  private formatPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  }

  protected validateData(data: any): boolean {
    return super.validateData(data) && 
           data.nome && 
           data.email && 
           this.isValidEmail(data.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Padrão Strategy - Delivery Calculation
export interface DeliveryStrategy {
  calculateDeliveryFee(distance: number, weight: number, urgency: 'normal' | 'express' | 'scheduled'): DeliveryResult;
  getEstimatedDeliveryTime(distance: number, urgency: 'normal' | 'express' | 'scheduled'): number; // em minutos
  getDeliveryMethod(): string;
  isAvailable(distance: number): boolean;
}

export interface DeliveryResult {
  fee: number;
  estimatedTimeMinutes: number;
  method: string;
  canDeliver: boolean;
  message?: string;
}

// Implementação concreta para entrega por moto
export class MotorcycleDeliveryStrategy implements DeliveryStrategy {
  private readonly MAX_DISTANCE = 15; // km
  private readonly MAX_WEIGHT = 10; // kg
  private readonly BASE_FEE = 5.00;
  private readonly PRICE_PER_KM = 1.50;

  calculateDeliveryFee(distance: number, weight: number, urgency: 'normal' | 'express' | 'scheduled'): DeliveryResult {
    if (!this.isAvailable(distance)) {
      return {
        fee: 0,
        estimatedTimeMinutes: 0,
        method: this.getDeliveryMethod(),
        canDeliver: false,
        message: `Entrega não disponível. Distância máxima: ${this.MAX_DISTANCE}km`
      };
    }

    if (weight > this.MAX_WEIGHT) {
      return {
        fee: 0,
        estimatedTimeMinutes: 0,
        method: this.getDeliveryMethod(),
        canDeliver: false,
        message: `Peso excede o limite máximo de ${this.MAX_WEIGHT}kg para moto`
      };
    }

    let fee = this.BASE_FEE + (distance * this.PRICE_PER_KM);
    
    // Multiplier baseado na urgência
    switch (urgency) {
      case 'express':
        fee *= 1.5;
        break;
      case 'scheduled':
        fee *= 0.9; // Desconto por agendamento
        break;
    }

    return {
      fee: parseFloat(fee.toFixed(2)),
      estimatedTimeMinutes: this.getEstimatedDeliveryTime(distance, urgency),
      method: this.getDeliveryMethod(),
      canDeliver: true
    };
  }

  getEstimatedDeliveryTime(distance: number, urgency: 'normal' | 'express' | 'scheduled'): number {
    const baseTime = (distance / 0.5) + 15; // 30 km/h + 15 min preparo
    
    switch (urgency) {
      case 'express':
        return Math.round(baseTime * 0.7); // 30% mais rápido
      case 'scheduled':
        return Math.round(baseTime * 1.2); // Pode demorar mais
      default:
        return Math.round(baseTime);
    }
  }

  getDeliveryMethod(): string {
    return 'Entrega por Moto';
  }

  isAvailable(distance: number): boolean {
    return distance <= this.MAX_DISTANCE;
  }
}

// Implementação concreta para entrega por carro
export class CarDeliveryStrategy implements DeliveryStrategy {
  private readonly MAX_DISTANCE = 30; // km
  private readonly MAX_WEIGHT = 50; // kg
  private readonly BASE_FEE = 8.00;
  private readonly PRICE_PER_KM = 2.00;

  calculateDeliveryFee(distance: number, weight: number, urgency: 'normal' | 'express' | 'scheduled'): DeliveryResult {
    if (!this.isAvailable(distance)) {
      return {
        fee: 0,
        estimatedTimeMinutes: 0,
        method: this.getDeliveryMethod(),
        canDeliver: false,
        message: `Entrega não disponível. Distância máxima: ${this.MAX_DISTANCE}km`
      };
    }

    if (weight > this.MAX_WEIGHT) {
      return {
        fee: 0,
        estimatedTimeMinutes: 0,
        method: this.getDeliveryMethod(),
        canDeliver: false,
        message: `Peso excede o limite máximo de ${this.MAX_WEIGHT}kg para carro`
      };
    }

    let fee = this.BASE_FEE + (distance * this.PRICE_PER_KM);
    
    // Multiplier baseado na urgência
    switch (urgency) {
      case 'express':
        fee *= 1.3;
        break;
      case 'scheduled':
        fee *= 0.85;
        break;
    }

    return {
      fee: parseFloat(fee.toFixed(2)),
      estimatedTimeMinutes: this.getEstimatedDeliveryTime(distance, urgency),
      method: this.getDeliveryMethod(),
      canDeliver: true
    };
  }

  getEstimatedDeliveryTime(distance: number, urgency: 'normal' | 'express' | 'scheduled'): number {
    const baseTime = (distance / 0.6) + 20; // 36 km/h + 20 min preparo
    
    switch (urgency) {
      case 'express':
        return Math.round(baseTime * 0.8);
      case 'scheduled':
        return Math.round(baseTime * 1.1);
      default:
        return Math.round(baseTime);
    }
  }

  getDeliveryMethod(): string {
    return 'Entrega por Carro';
  }

  isAvailable(distance: number): boolean {
    return distance <= this.MAX_DISTANCE;
  }
}

// Implementação concreta para retirada no local
export class PickupDeliveryStrategy implements DeliveryStrategy {
  calculateDeliveryFee(distance: number, weight: number, urgency: 'normal' | 'express' | 'scheduled'): DeliveryResult {
    return {
      fee: 0,
      estimatedTimeMinutes: this.getEstimatedDeliveryTime(distance, urgency),
      method: this.getDeliveryMethod(),
      canDeliver: true,
      message: 'Produto estará disponível para retirada na loja'
    };
  }

  getEstimatedDeliveryTime(distance: number, urgency: 'normal' | 'express' | 'scheduled'): number {
    switch (urgency) {
      case 'express':
        return 15; // 15 minutos para preparar
      case 'scheduled':
        return 30; // Agendado, pode demorar mais
      default:
        return 20; // Tempo padrão de preparo
    }
  }

  getDeliveryMethod(): string {
    return 'Retirada no Local';
  }

  isAvailable(distance: number): boolean {
    return true; // Sempre disponível
  }
}

// Context que utiliza as strategies
export class DeliveryCalculator {
  private strategy: DeliveryStrategy;

  constructor(strategy: DeliveryStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: DeliveryStrategy): void {
    this.strategy = strategy;
  }

  calculateDelivery(distance: number, weight: number, urgency: 'normal' | 'express' | 'scheduled' = 'normal'): DeliveryResult {
    return this.strategy.calculateDeliveryFee(distance, weight, urgency);
  }

  getDeliveryMethod(): string {
    return this.strategy.getDeliveryMethod();
  }

  isAvailable(distance: number): boolean {
    return this.strategy.isAvailable(distance);
  }
}

// Factory para criar strategies de entrega
export class DeliveryStrategyFactory {
  static createStrategy(deliveryMethod: string): DeliveryStrategy {
    switch (deliveryMethod.toLowerCase()) {
      case 'motorcycle':
      case 'moto':
        return new MotorcycleDeliveryStrategy();
      case 'car':
      case 'carro':
        return new CarDeliveryStrategy();
      case 'pickup':
      case 'retirada':
        return new PickupDeliveryStrategy();
      default:
        throw new Error(`Método de entrega não suportado: ${deliveryMethod}`);
    }
  }

  static getAvailableDeliveryMethods(): string[] {
    return ['motorcycle', 'car', 'pickup'];
  }

  static getBestDeliveryMethod(distance: number, weight: number): DeliveryStrategy {
    // Lógica para escolher o melhor método baseado na distância e peso
    if (distance <= 15 && weight <= 10) {
      return new MotorcycleDeliveryStrategy(); // Mais barato para curta distância
    } else if (distance <= 30 && weight <= 50) {
      return new CarDeliveryStrategy();
    } else {
      return new PickupDeliveryStrategy(); // Fallback
    }
  }
}

import { useState, useEffect, useCallback } from 'react';
import { 
  checkoutService, 
  CheckoutStep, 
  OrderSummary, 
  CreateOrderData, 
  OrderConfirmation,
  DeliveryCalculation
} from '../../services/customer/checkoutService';
import { DeliveryMethod, PaymentMethod, Address, CartItem } from '../../types';

export const useCheckout = (items: CartItem[]) => {
  const [steps, setSteps] = useState<CheckoutStep[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Checkout data
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryCalculation, setDeliveryCalculation] = useState<DeliveryCalculation | null>(null);
  const [notes, setNotes] = useState('');

  // Available options
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Initialize steps
  useEffect(() => {
    const initialSteps = checkoutService.getCheckoutSteps();
    setSteps(initialSteps);
  }, []);

  // Load delivery and payment methods
  useEffect(() => {
    const loadMethods = async () => {
      try {
        setLoading(true);
        const [deliveryData, paymentData] = await Promise.all([
          checkoutService.getDeliveryMethods(),
          checkoutService.getPaymentMethods()
        ]);
        setDeliveryMethods(deliveryData);
        setPaymentMethods(paymentData);
      } catch (err) {
        setError('Erro ao carregar métodos de entrega e pagamento');
      } finally {
        setLoading(false);
      }
    };

    loadMethods();
  }, []);

  // Calculate delivery when address and method change
  useEffect(() => {
    if (deliveryAddress && selectedDeliveryMethod && items.length > 0) {
      const calculateDelivery = async () => {
        try {
          const calculation = await checkoutService.calculateDelivery(
            items,
            deliveryAddress,
            selectedDeliveryMethod.id
          );
          setDeliveryCalculation(calculation);
        } catch (err) {
          console.error('Error calculating delivery:', err);
          setDeliveryCalculation(null);
        }
      };

      calculateDelivery();
    } else {
      setDeliveryCalculation(null);
    }
  }, [deliveryAddress, selectedDeliveryMethod, items]);

  const goToStep = useCallback((stepId: number) => {
    setCurrentStep(stepId);
    setSteps(prev => checkoutService.updateCheckoutSteps(prev, stepId));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const completeStep = useCallback((stepId: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, isCompleted: true } : step
    ));
  }, []);

  // Calculate order summary
  const getOrderSummary = useCallback((): OrderSummary => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.variation?.price || item.product.price;
      return sum + (price * item.quantity);
    }, 0);

    const deliveryFee = deliveryCalculation?.fee || 0;
    const total = subtotal + deliveryFee;

    return {
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryMethod: selectedDeliveryMethod || undefined,
      deliveryAddress: deliveryAddress || undefined,
      paymentMethod: selectedPaymentMethod || undefined
    };
  }, [items, deliveryCalculation, selectedDeliveryMethod, deliveryAddress, selectedPaymentMethod]);

  // Validate current step
  const validateCurrentStep = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1: // Identification - automatically valid if user is logged in
        break;
      
      case 2: // Delivery
        if (!deliveryAddress) {
          errors.push('Endereço de entrega é obrigatório');
        }
        if (!selectedDeliveryMethod) {
          errors.push('Método de entrega é obrigatório');
        }
        break;
      
      case 3: // Payment
        if (!selectedPaymentMethod) {
          errors.push('Método de pagamento é obrigatório');
        }
        break;
      
      case 4: // Review
        if (!deliveryAddress || !selectedDeliveryMethod || !selectedPaymentMethod) {
          errors.push('Dados do pedido incompletos');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [currentStep, deliveryAddress, selectedDeliveryMethod, selectedPaymentMethod]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Steps
    steps,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    completeStep,

    // Data
    deliveryAddress,
    setDeliveryAddress,
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    deliveryCalculation,
    notes,
    setNotes,

    // Available options
    deliveryMethods,
    paymentMethods,

    // State
    loading,
    error,
    clearError,

    // Helpers
    getOrderSummary,
    validateCurrentStep
  };
};

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (orderData: CreateOrderData): Promise<OrderConfirmation | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const confirmation = await checkoutService.createOrder(orderData);
      return confirmation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createOrder,
    loading,
    error,
    clearError
  };
};
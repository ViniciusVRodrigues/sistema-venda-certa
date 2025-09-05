import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input, LoadingSpinner, Modal } from '../../components/ui';
import { useCheckout, useCreateOrder } from '../../hooks/customer/useCheckout';
import { useAddresses } from '../../hooks/customer/useAddresses';
import { useCart } from '../../context/CartContext';
import type { Endereco } from '../../types';
import type { CreateAddressData } from '../../services/customer/addressService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const { addresses, createAddress } = useAddresses();
  const { createOrder, loading: orderLoading, error: orderError } = useCreateOrder();
  
  // Convert Endereco to Address for compatibility with useCheckout
  const convertEnderecoToAddress = (endereco: Endereco) => ({
    id: endereco.id,
    street: endereco.rua,
    number: endereco.numero,
    complement: endereco.complemento,
    neighborhood: endereco.bairro,
    city: endereco.cidade,
    state: endereco.estado,
    zipCode: endereco.cep,
    isDefault: endereco.favorito,
    customerId: endereco.fk_usuario_id
  });

  const {
    steps,
    currentStep,
    deliveryAddress,
    selectedDeliveryMethod,
    selectedPaymentMethod,
    deliveryCalculation,
    notes,
    deliveryMethods,
    paymentMethods,
    loading,
    error,
    setDeliveryAddress,
    setSelectedDeliveryMethod,
    setSelectedPaymentMethod,
    setNotes,
    nextStep,
    prevStep,
    validateCurrentStep,
    clearError
  } = useCheckout(cartItems);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState<CreateAddressData>({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    favorito: false,
    fk_usuario_id: 1
  });
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleNext = () => {
    const validation = validateCurrentStep();
    if (validation.isValid) {
      nextStep();
    }
  };

  const handleAddressSelect = (address: Endereco) => {
    setDeliveryAddress(convertEnderecoToAddress(address));
    clearError();
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAddress = await createAddress(newAddressForm);
      setDeliveryAddress(convertEnderecoToAddress(newAddress));
      setShowAddressModal(false);
      setNewAddressForm({
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        favorito: false,
        fk_usuario_id: 1
      });
    } catch {
      // Error handling is done by the hook
    }
  };

  const handleFinishOrder = async () => {
    if (!deliveryAddress || !selectedDeliveryMethod || !selectedPaymentMethod) {
      return;
    }

    try {
      setSubmittingOrder(true);
      const orderData = {
        items: cartItems,
        deliveryAddress,
        deliveryMethod: selectedDeliveryMethod,
        paymentMethod: selectedPaymentMethod,
        notes
      };

      const confirmation = await createOrder(orderData);
      if (confirmation) {
        clearCart();
        navigate('/customer/orders', { 
          state: { 
            message: `Pedido ${confirmation.order.id} criado com sucesso!`,
            orderId: confirmation.order.id 
          }
        });
      }
    } catch {
      // Error handling is done by the hook
    } finally {
      setSubmittingOrder(false);
    }
  };

  const currentValidation = validateCurrentStep();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = deliveryCalculation?.fee || selectedDeliveryMethod?.price || 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carrinho Vazio
          </h2>
          <p className="text-gray-600 mb-4">
            Adicione produtos ao carrinho para continuar com o checkout
          </p>
          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700">
              Ver Produtos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Carrinho
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Pedido</h1>
          <p className="text-gray-600">Complete as informações para finalizar sua compra</p>
        </div>

        {/* Steps Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step.isCompleted 
                    ? 'bg-green-600 text-white' 
                    : step.isActive 
                      ? 'bg-green-100 text-green-600 border-2 border-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {step.isCompleted ? '✓' : step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.isActive ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-4 w-12 h-0.5 ${
                    step.isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {(error || orderError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error || orderError}</span>
              <button
                onClick={() => {
                  clearError();
                  // Note: useCreateOrder should also have a clearError method
                }}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 2: Delivery */}
            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Endereço e Entrega</h2>
                
                {/* Address Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço de Entrega</h3>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          deliveryAddress?.id === address.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {address.rua}, {address.numero}
                              {address.complemento && `, ${address.complemento}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.bairro}, {address.cidade} - {address.estado}, {address.cep}
                            </p>
                            {address.favorito && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                Favorito
                              </span>
                            )}
                          </div>
                          <input
                            type="radio"
                            checked={deliveryAddress?.id === address.id}
                            onChange={() => handleAddressSelect(address)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressModal(true)}
                      className="w-full border-dashed border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar Novo Endereço
                    </Button>
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Entrega</h3>
                  <div className="space-y-3">
                    {deliveryMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDeliveryMethod?.id === method.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setSelectedDeliveryMethod(method)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            <p className="text-sm font-medium text-green-600 mt-1">
                              {method.price === 0 ? 'Grátis' : formatCurrency(method.price)}
                              {method.estimatedDays > 0 && (
                                ` - ${method.estimatedDays} dia${method.estimatedDays !== 1 ? 's' : ''}`
                              )}
                            </p>
                          </div>
                          <input
                            type="radio"
                            checked={selectedDeliveryMethod?.id === method.id}
                            onChange={() => setSelectedDeliveryMethod(method)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pagamento</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{method.name}</p>
                          {method.config?.instructions && (
                            <p className="text-sm text-gray-600 mt-1">
                              {method.config.instructions}
                            </p>
                          )}
                        </div>
                        <input
                          type="radio"
                          checked={selectedPaymentMethod?.id === method.id}
                          onChange={() => setSelectedPaymentMethod(method)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Input
                    label="Observações (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instruções especiais para entrega..."
                    helpText="Máximo 500 caracteres"
                    maxLength={500}
                  />
                </div>
              </Card>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Revisar Pedido</h2>
                
                <div className="space-y-6">
                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h3>
                    {deliveryAddress && (
                      <p className="text-gray-600">
                        {deliveryAddress.street}, {deliveryAddress.number}
                        {deliveryAddress.complement && `, ${deliveryAddress.complement}`}
                        <br />
                        {deliveryAddress.neighborhood}, {deliveryAddress.city} - {deliveryAddress.state}, {deliveryAddress.zipCode}
                      </p>
                    )}
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Método de Entrega</h3>
                    {selectedDeliveryMethod && (
                      <p className="text-gray-600">
                        {selectedDeliveryMethod.name} - {selectedDeliveryMethod.price === 0 ? 'Grátis' : formatCurrency(selectedDeliveryMethod.price)}
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Método de Pagamento</h3>
                    {selectedPaymentMethod && (
                      <p className="text-gray-600">{selectedPaymentMethod.name}</p>
                    )}
                  </div>

                  {/* Notes */}
                  {notes && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Observações</h3>
                      <p className="text-gray-600">{notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || loading || orderLoading}
              >
                Voltar
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!currentValidation.isValid || loading || orderLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading || orderLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Carregando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleFinishOrder}
                  disabled={!currentValidation.isValid || submittingOrder || orderLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submittingOrder ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Finalizando...
                    </>
                  ) : (
                    'Finalizar Pedido'
                  )}
                </Button>
              )}
            </div>

            {/* Validation Errors */}
            {!currentValidation.isValid && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <ul className="text-sm text-yellow-800 space-y-1">
                  {currentValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.variationId || ''}`} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} {item.product.unit} × {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatCurrency(item.quantity * item.product.price)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Entrega:</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Add Address Modal */}
        <Modal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          title="Adicionar Endereço"
        >
          <form onSubmit={handleCreateAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Rua"
                  value={newAddressForm.rua}
                  onChange={(e) => setNewAddressForm(prev => ({ ...prev, rua: e.target.value }))}
                  required
                />
              </div>
              
              <Input
                label="Número"
                value={newAddressForm.numero}
                onChange={(e) => setNewAddressForm(prev => ({ ...prev, numero: e.target.value }))}
                required
              />
              
              <Input
                label="Complemento"
                value={newAddressForm.complemento || ''}
                onChange={(e) => setNewAddressForm(prev => ({ ...prev, complemento: e.target.value }))}
                placeholder="Apto, bloco, etc."
              />
              
              <Input
                label="Bairro"
                value={newAddressForm.bairro}
                onChange={(e) => setNewAddressForm(prev => ({ ...prev, bairro: e.target.value }))}
                required
              />
              
              <Input
                label="Cidade"
                value={newAddressForm.cidade}
                onChange={(e) => setNewAddressForm(prev => ({ ...prev, cidade: e.target.value }))}
                required
              />
              
              <Input
                label="Estado"
                value={newAddressForm.estado}
                onChange={(e) => setNewAddressForm(prev => ({ ...prev, estado: e.target.value }))}
                maxLength={2}
                placeholder="SP"
                required
              />
              
              <Input
                label="CEP"
                value={newAddressForm.cep}
                onChange={(e) => setNewAddressForm(prev => ({ ...prev, cep: e.target.value }))}
                placeholder="12345-678"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddressModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                Salvar Endereço
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
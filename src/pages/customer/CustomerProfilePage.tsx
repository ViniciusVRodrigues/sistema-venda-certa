import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, LoadingSpinner, Modal } from '../../components/ui';
import { useProfile } from '../../hooks/customer/useProfile';
import type { UpdateProfileData, ChangePasswordData } from '../../services/customer/profileService';

export const CustomerProfilePage: React.FC = () => {
  const {
    profile,
    stats,
    loading,
    error,
    updateProfile,
    changePassword,
    clearError,
    validateProfile,
    validatePasswordChange,
    formatPhone
  } = useProfile();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phone: ''
  });
  const [profileErrors, setProfileErrors] = useState<string[]>([]);

  // Password form state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Initialize profile form when profile loads
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileErrors([]);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || ''
      });
    }
    setIsEditingProfile(false);
    setProfileErrors([]);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateProfile(profileForm);
    if (!validation.isValid) {
      setProfileErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      await updateProfile(profileForm);
      setIsEditingProfile(false);
      setProfileErrors([]);
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePasswordChange(passwordForm);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      await changePassword(passwordForm);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors([]);
      alert('Senha alterada com sucesso!');
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/customer/menu"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Menu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dados Pessoais</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações da conta</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    onClick={handleEditProfile}
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Profile Form Errors */}
                  {profileErrors.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <ul className="text-sm text-red-800 space-y-1">
                        {profileErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Input
                    label="Nome completo"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />

                  <Input
                    label="Telefone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar Alterações'
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <p className="text-gray-900">{profile?.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <p className="text-gray-900">
                      {profile?.phone ? formatPhone(profile.phone) : 'Não informado'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Membro desde
                    </label>
                    <p className="text-gray-900">
                      {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Security Section */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Segurança</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <p className="text-gray-900">••••••••</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordModal(true)}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Alterar Senha
                </Button>
              </div>
            </Card>
          </div>

          {/* Account Statistics */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Conta</h3>
              <div className="space-y-4">
                {stats?.isVip && (
                  <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-yellow-800 font-medium">
                      ⭐ Cliente VIP
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.totalOrders || 0}
                  </div>
                  <div className="text-sm text-gray-600">Pedidos Realizados</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats ? formatCurrency(stats.totalSpent) : 'R$ 0,00'}
                  </div>
                  <div className="text-sm text-gray-600">Total Gasto</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats ? formatCurrency(stats.averageOrderValue) : 'R$ 0,00'}
                  </div>
                  <div className="text-sm text-gray-600">Ticket Médio</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link
                  to="/customer/orders"
                  className="block w-full text-center px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Ver Pedidos
                </Link>
                <Link
                  to="/customer/addresses"
                  className="block w-full text-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Gerenciar Endereços
                </Link>
                <Link
                  to="/"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continuar Comprando
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordForm({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            setPasswordErrors([]);
          }}
          title="Alterar Senha"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Password Form Errors */}
            {passwordErrors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <ul className="text-sm text-red-800 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Input
              label="Senha atual"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />

            <Input
              label="Nova senha"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              helpText="Mínimo de 6 caracteres"
              required
            />

            <Input
              label="Confirmar nova senha"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordErrors([]);
                }}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Alterando...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
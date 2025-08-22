import { useState, useEffect, useCallback } from 'react';
import { profileService, type UpdateProfileData, type ChangePasswordData } from '../../services/customer/profileService';
import type { Customer } from '../../types';

export const useProfile = () => {
  const [profile, setProfile] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    memberSince: Date;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    isVip: boolean;
    lastOrderDate?: Date;
  } | null>(null);

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load account stats
  const loadStats = useCallback(async () => {
    try {
      const statsData = await profileService.getAccountStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar estatísticas da conta:', err);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<Customer> => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      await loadStats(); // Reload stats
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  // Change password
  const changePassword = useCallback(async (data: ChangePasswordData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await profileService.changePassword(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar senha';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const avatarUrl = await profileService.uploadAvatar(file);
      
      // Update profile with new avatar
      if (profile) {
        const updatedProfile = { ...profile, avatar: avatarUrl };
        setProfile(updatedProfile);
      }
      
      return avatarUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload da foto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load profile and stats on mount
  useEffect(() => {
    loadProfile();
    loadStats();
  }, [loadProfile, loadStats]);

  return {
    profile,
    stats,
    loading,
    error,
    updateProfile,
    changePassword,
    uploadAvatar,
    loadProfile,
    clearError,
    // Helper functions from service
    validateProfile: profileService.validateProfile,
    validatePasswordChange: profileService.validatePasswordChange,
    formatPhone: profileService.formatPhone
  };
};
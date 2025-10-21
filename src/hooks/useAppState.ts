import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useAppStateStore, useAppStateMonitor } from '@/stores/AppStateStore';
import { useSessionStore } from '@/stores/SessionStore';

/**
 * Hook para monitorar estado da aplicação
 */
export const useAppState = () => {
  const appState = useAppStateStore();
  const { handleAppStateChange, handleNetworkChange } = useAppStateMonitor();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => subscription?.remove();
  }, []);

  return appState;
};

/**
 * Hook para monitorar sessão do usuário
 */
export const useSessionMonitor = () => {
  const { isTokenValid, updateLastActivity, logout } = useSessionStore();
  const { isSessionExpired } = useAppStateStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // Verificar se token ainda é válido
      if (!isTokenValid()) {
        logout();
        return;
      }

      // Verificar se sessão expirou (30 minutos de inatividade)
      if (isSessionExpired(30)) {
        logout();
        return;
      }

      // Atualizar última atividade
      updateLastActivity();
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [isTokenValid, isSessionExpired, logout, updateLastActivity]);
};

/**
 * Hook para gerenciar loading states
 */
export const useLoadingManager = () => {
  const { setLoading, isLoading, clearAllLoadings } = useLoadingStore();

  const startLoading = (id: string, message?: string) => {
    setLoading(id, true, message);
  };

  const stopLoading = (id: string) => {
    setLoading(id, false);
  };

  const withLoading = async <T>(
    id: string,
    operation: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      startLoading(id, message);
      const result = await operation();
      return result;
    } finally {
      stopLoading(id);
    }
  };

  return {
    startLoading,
    stopLoading,
    withLoading,
    isLoading,
    clearAllLoadings
  };
};

/**
 * Hook para gerenciar estado de autenticação
 */
export const useAuthState = () => {
  const {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    isAdmin,
    isTeacher,
    hasPermission
  } = useSessionStore();

  return {
    user,
    token,
    isAuthenticated,
    isAdmin: isAdmin(),
    isTeacher: isTeacher(),
    login,
    logout,
    updateUser,
    hasPermission
  };
};

/**
 * Hook para gerenciar estado de datas
 */
export const useDateManager = () => {
  const {
    currentDate,
    selectedDate,
    correctedDate,
    setCurrentDate,
    setSelectedDate,
    setCorrectedDate,
    getFormattedDate,
    isToday,
    isFuture,
    isPast,
    isValidDate,
    isWeekend,
    isBusinessDay
  } = useDateStore();

  return {
    currentDate,
    selectedDate,
    correctedDate,
    setCurrentDate,
    setSelectedDate,
    setCorrectedDate,
    getFormattedDate,
    isToday,
    isFuture,
    isPast,
    isValidDate,
    isWeekend,
    isBusinessDay
  };
};

/**
 * Hook para gerenciar estado de fotos
 */
export const usePhotoManager = () => {
  const {
    selectedPhoto,
    previewUri,
    uploadProgress,
    isUploading,
    uploadError,
    setSelectedPhoto,
    setPreviewUri,
    setUploadProgress,
    setUploading,
    setUploadError,
    hasPhoto,
    isValidPhoto,
    clearPhoto,
    reset
  } = usePhotoStore();

  return {
    selectedPhoto,
    previewUri,
    uploadProgress,
    isUploading,
    uploadError,
    setSelectedPhoto,
    setPreviewUri,
    setUploadProgress,
    setUploading,
    setUploadError,
    hasPhoto: hasPhoto(),
    isValidPhoto: isValidPhoto(),
    clearPhoto,
    reset
  };
};

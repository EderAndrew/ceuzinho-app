import { create } from "zustand"

export interface LoadingState {
  id: string;
  message?: string;
  progress?: number;
  startTime: Date;
}

export interface LoadingStore {
  // State
  loadings: Record<string, LoadingState>;
  
  // Actions
  setLoading: (id: string, isLoading: boolean, message?: string) => void;
  setProgress: (id: string, progress: number) => void;
  setMessage: (id: string, message: string) => void;
  clearLoading: (id: string) => void;
  clearAllLoadings: () => void;
  
  // Computed
  isLoading: (id: string) => boolean;
  getLoading: (id: string) => LoadingState | undefined;
  hasAnyLoading: () => boolean;
  getLoadingCount: () => number;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  // Initial state
  loadings: {},

  // Actions
  setLoading: (id, isLoading, message) => {
    if (isLoading) {
      set((state) => ({
        loadings: {
          ...state.loadings,
          [id]: {
            id,
            message,
            startTime: new Date()
          }
        }
      }));
    } else {
      set((state) => {
        const newLoadings = { ...state.loadings };
        delete newLoadings[id];
        return { loadings: newLoadings };
      });
    }
  },

  setProgress: (id, progress) => {
    set((state) => ({
      loadings: {
        ...state.loadings,
        [id]: {
          ...state.loadings[id],
          progress: Math.max(0, Math.min(100, progress))
        }
      }
    }));
  },

  setMessage: (id, message) => {
    set((state) => ({
      loadings: {
        ...state.loadings,
        [id]: {
          ...state.loadings[id],
          message
        }
      }
    }));
  },

  clearLoading: (id) => {
    set((state) => {
      const newLoadings = { ...state.loadings };
      delete newLoadings[id];
      return { loadings: newLoadings };
    });
  },

  clearAllLoadings: () => set({ loadings: {} }),

  // Computed
  isLoading: (id) => {
    const { loadings } = get();
    return id in loadings;
  },

  getLoading: (id) => {
    const { loadings } = get();
    return loadings[id];
  },

  hasAnyLoading: () => {
    const { loadings } = get();
    return Object.keys(loadings).length > 0;
  },

  getLoadingCount: () => {
    const { loadings } = get();
    return Object.keys(loadings).length;
  }
}));

// Hook de compatibilidade para não quebrar código existente
export const useLoading = () => {
  const { setLoading, hasAnyLoading } = useLoadingStore();
  
  return {
    load: hasAnyLoading(),
    setLoad: (isLoading: boolean) => setLoading('global', isLoading)
  };
};

// Hooks específicos para diferentes tipos de loading
export const useAuthLoading = () => {
  const { setLoading, isLoading, getLoading } = useLoadingStore();
  
  return {
    isLoading: isLoading('auth'),
    setLoading: (loading: boolean, message?: string) => setLoading('auth', loading, message),
    getLoading: () => getLoading('auth')
  };
};

export const useScheduleLoading = () => {
  const { setLoading, isLoading, getLoading } = useLoadingStore();
  
  return {
    isLoading: isLoading('schedule'),
    setLoading: (loading: boolean, message?: string) => setLoading('schedule', loading, message),
    getLoading: () => getLoading('schedule')
  };
};

export const useUserLoading = () => {
  const { setLoading, isLoading, getLoading } = useLoadingStore();
  
  return {
    isLoading: isLoading('user'),
    setLoading: (loading: boolean, message?: string) => setLoading('user', loading, message),
    getLoading: () => getLoading('user')
  };
};

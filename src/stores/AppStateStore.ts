import { create } from "zustand"
import { AppState } from "react-native"

export interface AppStateData {
  isActive: boolean;
  isBackground: boolean;
  isInactive: boolean;
  networkStatus: 'online' | 'offline' | 'unknown';
  lastActiveTime: Date;
  sessionDuration: number; // em minutos
}

export interface AppStateStore extends AppStateData {
  // Actions
  setAppState: (state: string) => void;
  setNetworkStatus: (status: 'online' | 'offline' | 'unknown') => void;
  updateSessionDuration: () => void;
  resetSession: () => void;
  
  // Computed
  getSessionDurationMinutes: () => number;
  isSessionExpired: (maxMinutes?: number) => boolean;
}

export const useAppStateStore = create<AppStateStore>((set, get) => ({
  // Initial state
  isActive: true,
  isBackground: false,
  isInactive: false,
  networkStatus: 'unknown',
  lastActiveTime: new Date(),
  sessionDuration: 0,

  // Actions
  setAppState: (state) => {
    const now = new Date();
    const { lastActiveTime } = get();
    
    set({
      isActive: state === 'active',
      isBackground: state === 'background',
      isInactive: state === 'inactive',
      lastActiveTime: state === 'active' ? now : lastActiveTime
    });
  },

  setNetworkStatus: (status) => set({ networkStatus: status }),

  updateSessionDuration: () => {
    const { lastActiveTime } = get();
    const now = new Date();
    const duration = Math.floor((now.getTime() - lastActiveTime.getTime()) / (1000 * 60));
    set({ sessionDuration: duration });
  },

  resetSession: () => set({
    lastActiveTime: new Date(),
    sessionDuration: 0
  }),

  // Computed
  getSessionDurationMinutes: () => {
    const { lastActiveTime } = get();
    const now = new Date();
    return Math.floor((now.getTime() - lastActiveTime.getTime()) / (1000 * 60));
  },

  isSessionExpired: (maxMinutes = 30) => {
    const duration = get().getSessionDurationMinutes();
    return duration > maxMinutes;
  }
}));

// Hook para monitorar estado da aplicação
export const useAppStateMonitor = () => {
  const { setAppState, setNetworkStatus } = useAppStateStore();

  // Monitorar mudanças de estado da aplicação
  const handleAppStateChange = (nextAppState: string) => {
    setAppState(nextAppState);
  };

  // Monitorar status da rede (simulado - em produção usaria NetInfo)
  const handleNetworkChange = (isConnected: boolean) => {
    setNetworkStatus(isConnected ? 'online' : 'offline');
  };

  return {
    handleAppStateChange,
    handleNetworkChange
  };
};

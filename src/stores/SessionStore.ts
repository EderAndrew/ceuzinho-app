import { IUser } from "@/interfaces/IUser"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface AuthSession {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  lastActivity: Date;
  refreshToken?: string;
}

export interface SessionStore extends AuthSession {
  // Actions
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  login: (user: IUser, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<IUser>) => void;
  isTokenValid: () => boolean;
  updateLastActivity: () => void;
  clearSession: () => void;
  
  // Computed
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 horas

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      lastActivity: new Date(),
      refreshToken: null,

      // Actions
      setUser: (user) => set({ user }),
      
      setToken: (token) => set({ token }),
      
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      
      login: (user, token, refreshToken) => set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        lastActivity: new Date()
      }),
      
      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        lastActivity: new Date()
      }),
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
      
      isTokenValid: () => {
        const { token, lastActivity } = get();
        if (!token) return false;
        
        const now = new Date();
        const timeDiff = now.getTime() - lastActivity.getTime();
        return timeDiff < TOKEN_EXPIRY_TIME;
      },
      
      updateLastActivity: () => set({ lastActivity: new Date() }),
      
      clearSession: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        lastActivity: new Date()
      }),
      
      // Computed properties
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
      },
      
      isTeacher: () => {
        const { user } = get();
        return user?.role === 'TEACHER';
      },
      
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        
        const roleHierarchy = {
          'USER': 1,
          'TEACHER': 2,
          'ADMIN': 3,
          'SUPER_ADMIN': 4
        };
        
        const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
        const requiredLevel = roleHierarchy[permission as keyof typeof roleHierarchy] || 0;
        
        return userLevel >= requiredLevel;
      }
    }),
    {
      name: "session-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity
      })
    }
  )
);

// Hook de compatibilidade para não quebrar código existente
export const useUser = () => {
  const { user, token, setUser, setToken } = useSessionStore();
  return {
    user: user ? [user] : null, // Mantém compatibilidade com array
    token,
    setUser: (users: IUser[] | null) => setUser(users?.[0] || null),
    setToken
  };
};

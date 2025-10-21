// Exportações dos stores melhorados
export { useSessionStore, useUser } from './SessionStore';
export { useLoadingStore, useLoading, useAuthLoading, useScheduleLoading, useUserLoading } from './LoadingStore';
export { useAppStateStore, useAppStateMonitor } from './AppStateStore';
export { useDateStore, useDate } from './DateStore';
export { usePhotoStore, usePhoto } from './PhotoStore';

// Exportações dos hooks personalizados
export {
  useAppState,
  useSessionMonitor,
  useLoadingManager,
  useAuthState,
  useDateManager,
  usePhotoManager
} from '../hooks/useAppState';

// Tipos
export type { AuthSession, SessionStore } from './SessionStore';
export type { LoadingState, LoadingStore } from './LoadingStore';
export type { AppStateData, AppStateStore } from './AppStateStore';
export type { DateState, DateStore } from './DateStore';
export type { PhotoState, PhotoStore, PhotoUpload } from './PhotoStore';

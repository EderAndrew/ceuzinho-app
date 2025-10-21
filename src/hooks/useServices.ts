import { useMemo } from 'react';
import { useRepositories } from './useRepositories';
import { ServiceFactory } from '@/services/ServiceFactory';

/**
 * Hook para acessar todos os serviços de forma centralizada
 * Garante que as instâncias sejam reutilizadas e não recriadas desnecessariamente
 */
export const useServices = () => {
  const { user: userRepository, schedule: scheduleRepository } = useRepositories();

  const services = useMemo(() => {
    return ServiceFactory.createAllServices(userRepository, scheduleRepository);
  }, [userRepository, scheduleRepository]);

  return services;
};

/**
 * Hook específico para o AuthService
 */
export const useAuthService = () => {
  const { auth } = useServices();
  return auth;
};

/**
 * Hook específico para o ScheduleService
 */
export const useScheduleService = () => {
  const { schedule } = useServices();
  return schedule;
};

/**
 * Hook específico para o UserService
 */
export const useUserService = () => {
  const { user } = useServices();
  return user;
};

/**
 * Hook específico para o NotificationService
 */
export const useNotificationService = () => {
  const { notification } = useServices();
  return notification;
};

/**
 * Hook específico para o ValidationService
 */
export const useValidationService = () => {
  const { validation } = useServices();
  return validation;
};

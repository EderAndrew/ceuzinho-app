import { useMemo } from 'react';
import { api } from '@/api/connection';
import { RepositoryFactory } from '@/repositories/RepositoryFactory';

/**
 * Hook para acessar os repositórios de forma centralizada
 * Garante que as instâncias sejam reutilizadas e não recriadas desnecessariamente
 */
export const useRepositories = () => {
  const repositories = useMemo(() => {
    return RepositoryFactory.createAllRepositories(api);
  }, []);

  return repositories;
};

/**
 * Hook específico para o repositório de usuários
 */
export const useUserRepository = () => {
  const { user } = useRepositories();
  return user;
};

/**
 * Hook específico para o repositório de agendamentos
 */
export const useScheduleRepository = () => {
  const { schedule } = useRepositories();
  return schedule;
};

import { AxiosInstance } from 'axios';
import { UserRepository } from './UserRepository';
import { ScheduleRepository } from './ScheduleRepository';

/**
 * Factory para criar instâncias dos repositórios
 * Centraliza a criação e configuração dos repositórios
 */
export class RepositoryFactory {
  private static userRepository: UserRepository | null = null;
  private static scheduleRepository: ScheduleRepository | null = null;

  /**
   * Cria ou retorna a instância do UserRepository
   */
  static getUserRepository(api: AxiosInstance): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository(api);
    }
    return this.userRepository;
  }

  /**
   * Cria ou retorna a instância do ScheduleRepository
   */
  static getScheduleRepository(api: AxiosInstance): ScheduleRepository {
    if (!this.scheduleRepository) {
      this.scheduleRepository = new ScheduleRepository(api);
    }
    return this.scheduleRepository;
  }

  /**
   * Limpa as instâncias dos repositórios
   * Útil para testes ou quando necessário recriar as instâncias
   */
  static clearRepositories(): void {
    this.userRepository = null;
    this.scheduleRepository = null;
  }

  /**
   * Cria todos os repositórios de uma vez
   */
  static createAllRepositories(api: AxiosInstance) {
    return {
      user: this.getUserRepository(api),
      schedule: this.getScheduleRepository(api),
    };
  }
}

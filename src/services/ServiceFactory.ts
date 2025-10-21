import { UserRepository } from '@/repositories/UserRepository';
import { ScheduleRepository } from '@/repositories/ScheduleRepository';
import { AuthService } from './AuthService';
import { ScheduleService } from './ScheduleService';
import { UserService } from './UserService';
import { NotificationService } from './NotificationService';
import { ValidationService } from './ValidationService';

/**
 * Factory para criar e gerenciar instâncias dos serviços
 * Implementa o padrão Singleton para garantir uma única instância de cada serviço
 */
export class ServiceFactory {
  private static authService: AuthService | null = null;
  private static scheduleService: ScheduleService | null = null;
  private static userService: UserService | null = null;
  private static notificationService: NotificationService | null = null;
  private static validationService: ValidationService | null = null;

  /**
   * Cria ou retorna a instância do AuthService
   */
  static getAuthService(userRepository: UserRepository): AuthService {
    if (!this.authService) {
      this.authService = new AuthService(userRepository);
    }
    return this.authService;
  }

  /**
   * Cria ou retorna a instância do ScheduleService
   */
  static getScheduleService(scheduleRepository: ScheduleRepository): ScheduleService {
    if (!this.scheduleService) {
      this.scheduleService = new ScheduleService(scheduleRepository);
    }
    return this.scheduleService;
  }

  /**
   * Cria ou retorna a instância do UserService
   */
  static getUserService(userRepository: UserRepository): UserService {
    if (!this.userService) {
      this.userService = new UserService(userRepository);
    }
    return this.userService;
  }

  /**
   * Cria ou retorna a instância do NotificationService
   */
  static getNotificationService(): NotificationService {
    if (!this.notificationService) {
      this.notificationService = new NotificationService();
    }
    return this.notificationService;
  }

  /**
   * Cria ou retorna a instância do ValidationService
   */
  static getValidationService(): ValidationService {
    if (!this.validationService) {
      this.validationService = new ValidationService();
    }
    return this.validationService;
  }

  /**
   * Cria todos os serviços de uma vez
   */
  static createAllServices(
    userRepository: UserRepository,
    scheduleRepository: ScheduleRepository
  ) {
    return {
      auth: this.getAuthService(userRepository),
      schedule: this.getScheduleService(scheduleRepository),
      user: this.getUserService(userRepository),
      notification: this.getNotificationService(),
      validation: this.getValidationService()
    };
  }

  /**
   * Limpa todas as instâncias dos serviços
   * Útil para testes ou quando necessário recriar as instâncias
   */
  static clearServices(): void {
    this.authService = null;
    this.scheduleService = null;
    this.userService = null;
    this.notificationService = null;
    this.validationService = null;
  }

  /**
   * Reinicializa um serviço específico
   */
  static resetService(serviceName: keyof ReturnType<typeof this.createAllServices>): void {
    switch (serviceName) {
      case 'auth':
        this.authService = null;
        break;
      case 'schedule':
        this.scheduleService = null;
        break;
      case 'user':
        this.userService = null;
        break;
      case 'notification':
        this.notificationService = null;
        break;
      case 'validation':
        this.validationService = null;
        break;
    }
  }

  /**
   * Verifica se um serviço está inicializado
   */
  static isServiceInitialized(serviceName: keyof ReturnType<typeof this.createAllServices>): boolean {
    switch (serviceName) {
      case 'auth':
        return this.authService !== null;
      case 'schedule':
        return this.scheduleService !== null;
      case 'user':
        return this.userService !== null;
      case 'notification':
        return this.notificationService !== null;
      case 'validation':
        return this.validationService !== null;
      default:
        return false;
    }
  }

  /**
   * Obtém estatísticas dos serviços
   */
  static getServicesStats(): {
    total: number;
    initialized: number;
    services: Record<string, boolean>;
  } {
    const services = {
      auth: this.authService !== null,
      schedule: this.scheduleService !== null,
      user: this.userService !== null,
      notification: this.notificationService !== null,
      validation: this.validationService !== null
    };

    const initialized = Object.values(services).filter(Boolean).length;

    return {
      total: Object.keys(services).length,
      initialized,
      services
    };
  }
}

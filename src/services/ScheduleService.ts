import { BaseService, ServiceResponse, PaginatedServiceResponse } from './BaseService';
import { ScheduleRepository } from '@/repositories/ScheduleRepository';
import { ISchedules } from '@/interfaces/ISchedules';

export interface CreateScheduleData {
  title: string;
  description?: string;
  date: string;
  time: string;
  roomId: number;
  userId: number;
  bgColor?: string;
}

export interface UpdateScheduleData {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  roomId?: number;
  bgColor?: string;
}

export interface ScheduleFilters {
  date?: string;
  month?: string;
  year?: string;
  userId?: number;
  roomId?: number;
  status?: boolean;
}

export interface ScheduleStats {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export interface AvailabilityCheck {
  available: boolean;
  message?: string;
  conflictingSchedules?: ISchedules[];
}

/**
 * Serviço de agendamentos com lógica de negócio robusta
 */
export class ScheduleService extends BaseService {
  private scheduleRepository: ScheduleRepository;

  constructor(scheduleRepository: ScheduleRepository) {
    super('ScheduleService');
    this.scheduleRepository = scheduleRepository;
  }

  /**
   * Busca agendamentos por data com cache e validações
   */
  async getSchedulesByDate(
    date: string, 
    token: string
  ): Promise<ServiceResponse<ISchedules[]>> {
    try {
      this.log('info', 'Buscando agendamentos por data', { date });

      // Validação da data
      if (!this.validateDate(date)) {
        return this.createErrorResponse('Data inválida ou no passado', 400);
      }

      // Verificar cache
      const cacheKey = `schedules_${date}`;
      const cachedSchedules = this.getCache<ISchedules[]>(cacheKey);
      if (cachedSchedules) {
        this.log('info', 'Agendamentos carregados do cache');
        return this.createSuccessResponse(cachedSchedules);
      }

      // Buscar do repositório
      const schedules = await this.scheduleRepository.getByDate(date, token);

      // Cache por 5 minutos
      this.setCache(cacheKey, schedules, 300000);

      this.log('info', 'Agendamentos carregados', { count: schedules.length });
      return this.createSuccessResponse(schedules);

    } catch (error) {
      this.log('error', 'Erro ao buscar agendamentos por data', error);
      return this.handleError(error, 'getSchedulesByDate');
    }
  }

  /**
   * Cria um novo agendamento com validações robustas
   */
  async createSchedule(
    data: CreateScheduleData, 
    token: string
  ): Promise<ServiceResponse<ISchedules>> {
    try {
      this.log('info', 'Criando novo agendamento', { title: data.title, date: data.date });

      // Validação dos dados obrigatórios
      const validation = this.validateRequiredFields(data, [
        'title', 'date', 'time', 'roomId', 'userId'
      ]);
      
      if (!validation.isValid) {
        return this.createErrorResponse(
          `Dados inválidos: ${validation.errors.join(', ')}`,
          400
        );
      }

      // Validação da data
      if (!this.validateDate(data.date)) {
        return this.createErrorResponse('Data deve ser futura', 400);
      }

      // Validação do horário
      if (!this.validateTime(data.time)) {
        return this.createErrorResponse('Horário inválido', 400);
      }

      // Verificar disponibilidade
      const availability = await this.checkAvailability(
        data.date, 
        data.time, 
        data.roomId, 
        token
      );

      if (!availability.available) {
        return this.createErrorResponse(
          availability.message || 'Horário não disponível',
          409
        );
      }

      // Criar agendamento
      const schedule = await this.scheduleRepository.createSchedule(data, token);

      // Limpar cache relacionado
      this.clearCache(`schedules_${data.date}`);
      this.clearCache('schedules_month');

      this.log('info', 'Agendamento criado com sucesso', { 
        id: schedule.id, 
        title: schedule.title 
      });

      return this.createSuccessResponse(
        schedule,
        'Agendamento criado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao criar agendamento', error);
      return this.handleError(error, 'createSchedule');
    }
  }

  /**
   * Atualiza um agendamento existente
   */
  async updateSchedule(
    id: number, 
    data: UpdateScheduleData, 
    token: string
  ): Promise<ServiceResponse<ISchedules>> {
    try {
      this.log('info', 'Atualizando agendamento', { id });

      // Validação da data se fornecida
      if (data.date && !this.validateDate(data.date)) {
        return this.createErrorResponse('Data deve ser futura', 400);
      }

      // Validação do horário se fornecido
      if (data.time && !this.validateTime(data.time)) {
        return this.createErrorResponse('Horário inválido', 400);
      }

      // Verificar disponibilidade se data/horário foram alterados
      if (data.date || data.time) {
        const currentSchedule = await this.scheduleRepository.getById(id);
        const checkDate = data.date || currentSchedule.date;
        const checkTime = data.time || currentSchedule.time;
        const checkRoomId = data.roomId || currentSchedule.roomId;

        const availability = await this.checkAvailability(
          checkDate, 
          checkTime, 
          checkRoomId, 
          token
        );

        if (!availability.available) {
          return this.createErrorResponse(
            availability.message || 'Horário não disponível',
            409
          );
        }
      }

      // Atualizar agendamento
      const updatedSchedule = await this.scheduleRepository.updateSchedule(id, data, token);

      // Limpar cache relacionado
      this.clearCache('schedules_');
      this.clearCache('schedules_month');

      this.log('info', 'Agendamento atualizado com sucesso', { id });
      return this.createSuccessResponse(
        updatedSchedule,
        'Agendamento atualizado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao atualizar agendamento', error);
      return this.handleError(error, 'updateSchedule');
    }
  }

  /**
   * Remove um agendamento
   */
  async deleteSchedule(id: number, token: string): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Removendo agendamento', { id });

      await this.scheduleRepository.delete(id);

      // Limpar cache relacionado
      this.clearCache('schedules_');
      this.clearCache('schedules_month');

      this.log('info', 'Agendamento removido com sucesso', { id });
      return this.createSuccessResponse(
        undefined,
        'Agendamento removido com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao remover agendamento', error);
      return this.handleError(error, 'deleteSchedule');
    }
  }

  /**
   * Busca agendamentos por mês e usuário
   */
  async getSchedulesByMonth(
    month: string, 
    userId: number, 
    token: string
  ): Promise<ServiceResponse<ISchedules[]>> {
    try {
      this.log('info', 'Buscando agendamentos do mês', { month, userId });

      // Validação do mês
      if (!this.validateMonth(month)) {
        return this.createErrorResponse('Mês inválido', 400);
      }

      // Verificar cache
      const cacheKey = `schedules_month_${month}_${userId}`;
      const cachedSchedules = this.getCache<ISchedules[]>(cacheKey);
      if (cachedSchedules) {
        this.log('info', 'Agendamentos do mês carregados do cache');
        return this.createSuccessResponse(cachedSchedules);
      }

      // Buscar do repositório
      const schedules = await this.scheduleRepository.getByMonthAndUser(month, userId, token);

      // Cache por 10 minutos
      this.setCache(cacheKey, schedules, 600000);

      this.log('info', 'Agendamentos do mês carregados', { count: schedules.length });
      return this.createSuccessResponse(schedules);

    } catch (error) {
      this.log('error', 'Erro ao buscar agendamentos do mês', error);
      return this.handleError(error, 'getSchedulesByMonth');
    }
  }

  /**
   * Verifica disponibilidade de horário
   */
  async checkAvailability(
    date: string, 
    time: string, 
    roomId: number, 
    token: string
  ): Promise<AvailabilityCheck> {
    try {
      this.log('info', 'Verificando disponibilidade', { date, time, roomId });

      // Validações básicas
      if (!this.validateDate(date)) {
        return { available: false, message: 'Data inválida' };
      }

      if (!this.validateTime(time)) {
        return { available: false, message: 'Horário inválido' };
      }

      // Verificar no repositório
      const result = await this.scheduleRepository.checkAvailability(date, time, roomId, token);

      this.log('info', 'Disponibilidade verificada', { 
        available: result.available, 
        message: result.message 
      });

      return result;

    } catch (error) {
      this.log('error', 'Erro ao verificar disponibilidade', error);
      return { 
        available: false, 
        message: 'Erro ao verificar disponibilidade' 
      };
    }
  }

  /**
   * Busca estatísticas de agendamentos
   */
  async getScheduleStats(
    filters: ScheduleFilters, 
    token: string
  ): Promise<ServiceResponse<ScheduleStats>> {
    try {
      this.log('info', 'Buscando estatísticas de agendamentos', filters);

      const stats = await this.scheduleRepository.getStats(filters, token);

      this.log('info', 'Estatísticas carregadas', stats);
      return this.createSuccessResponse(stats);

    } catch (error) {
      this.log('error', 'Erro ao buscar estatísticas', error);
      return this.handleError(error, 'getScheduleStats');
    }
  }

  /**
   * Busca próximos agendamentos
   */
  async getUpcomingSchedules(
    limit: number = 5, 
    token: string
  ): Promise<ServiceResponse<ISchedules[]>> {
    try {
      this.log('info', 'Buscando próximos agendamentos', { limit });

      const schedules = await this.scheduleRepository.getUpcoming(limit, token);

      this.log('info', 'Próximos agendamentos carregados', { count: schedules.length });
      return this.createSuccessResponse(schedules);

    } catch (error) {
      this.log('error', 'Erro ao buscar próximos agendamentos', error);
      return this.handleError(error, 'getUpcomingSchedules');
    }
  }

  /**
   * Cancela um agendamento
   */
  async cancelSchedule(
    id: number, 
    reason?: string, 
    token: string
  ): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Cancelando agendamento', { id, reason });

      await this.scheduleRepository.cancelSchedule(id, reason, token);

      // Limpar cache relacionado
      this.clearCache('schedules_');

      this.log('info', 'Agendamento cancelado com sucesso', { id });
      return this.createSuccessResponse(
        undefined,
        'Agendamento cancelado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao cancelar agendamento', error);
      return this.handleError(error, 'cancelSchedule');
    }
  }

  /**
   * Confirma um agendamento
   */
  async confirmSchedule(id: number, token: string): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Confirmando agendamento', { id });

      await this.scheduleRepository.confirmSchedule(id, token);

      // Limpar cache relacionado
      this.clearCache('schedules_');

      this.log('info', 'Agendamento confirmado com sucesso', { id });
      return this.createSuccessResponse(
        undefined,
        'Agendamento confirmado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao confirmar agendamento', error);
      return this.handleError(error, 'confirmSchedule');
    }
  }

  /**
   * Busca agendamentos com filtros avançados
   */
  async searchSchedules(
    filters: ScheduleFilters, 
    token: string
  ): Promise<ServiceResponse<ISchedules[]>> {
    try {
      this.log('info', 'Buscando agendamentos com filtros', filters);

      const schedules = await this.scheduleRepository.getWithFilters(filters, token);

      this.log('info', 'Agendamentos encontrados', { count: schedules.length });
      return this.createSuccessResponse(schedules);

    } catch (error) {
      this.log('error', 'Erro ao buscar agendamentos', error);
      return this.handleError(error, 'searchSchedules');
    }
  }

  /**
   * Validação de mês (formato MM)
   */
  private validateMonth(month: string): boolean {
    const monthNum = parseInt(month);
    return monthNum >= 1 && monthNum <= 12;
  }

  /**
   * Verifica se um agendamento pode ser editado
   */
  canEditSchedule(schedule: ISchedules): boolean {
    const scheduleDate = new Date(schedule.date);
    const now = new Date();
    const timeDiff = scheduleDate.getTime() - now.getTime();
    
    // Só pode editar se for pelo menos 1 hora antes do agendamento
    return timeDiff > 60 * 60 * 1000;
  }

  /**
   * Verifica se um agendamento pode ser cancelado
   */
  canCancelSchedule(schedule: ISchedules): boolean {
    const scheduleDate = new Date(schedule.date);
    const now = new Date();
    const timeDiff = scheduleDate.getTime() - now.getTime();
    
    // Só pode cancelar se for pelo menos 30 minutos antes do agendamento
    return timeDiff > 30 * 60 * 1000;
  }
}

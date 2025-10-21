import { AxiosInstance } from 'axios';
import { BaseRepository, ApiResponse } from './BaseRepository';
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

export class ScheduleRepository extends BaseRepository<ISchedules, CreateScheduleData, UpdateScheduleData> {
  constructor(api: AxiosInstance) {
    super(api, '/schedules');
  }

  /**
   * Busca agendamentos por data específica
   */
  async getByDate(date: string, token: string): Promise<ISchedules[]> {
    try {
      const response = await this.api.get<ISchedules[]>(`/schedules/date/${date}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca agendamentos por mês e usuário
   */
  async getByMonthAndUser(month: string, userId: number, token: string): Promise<ISchedules[]> {
    try {
      const response = await this.api.get<ISchedules[]>(`/schedules/month/${month}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca agendamentos por período
   */
  async getByDateRange(startDate: string, endDate: string, token: string): Promise<ISchedules[]> {
    try {
      const response = await this.api.get<ISchedules[]>('/schedules/range', {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca agendamentos com filtros avançados
   */
  async getWithFilters(filters: ScheduleFilters, token: string): Promise<ISchedules[]> {
    try {
      const response = await this.api.get<ISchedules[]>('/schedules/filter', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cria um novo agendamento
   */
  async createSchedule(data: CreateScheduleData, token: string): Promise<ISchedules> {
    try {
      const response = await this.api.post<ISchedules>('/schedules', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Atualiza um agendamento existente
   */
  async updateSchedule(id: number, data: UpdateScheduleData, token: string): Promise<ISchedules> {
    try {
      const response = await this.api.put<ISchedules>(`/schedules/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cancela um agendamento
   */
  async cancelSchedule(id: number, reason?: string, token: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.patch<ApiResponse<void>>(`/schedules/${id}/cancel`, 
        { reason }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Confirma um agendamento
   */
  async confirmSchedule(id: number, token: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.patch<ApiResponse<void>>(`/schedules/${id}/confirm`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca estatísticas de agendamentos
   */
  async getStats(filters: ScheduleFilters, token: string): Promise<ScheduleStats> {
    try {
      const response = await this.api.get<ScheduleStats>('/schedules/stats', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca próximos agendamentos
   */
  async getUpcoming(limit: number = 5, token: string): Promise<ISchedules[]> {
    try {
      const response = await this.api.get<ISchedules[]>(`/schedules/upcoming?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Verifica disponibilidade de horário
   */
  async checkAvailability(date: string, time: string, roomId: number, token: string): Promise<{ available: boolean; message?: string }> {
    try {
      const response = await this.api.get<{ available: boolean; message?: string }>('/schedules/check-availability', {
        params: { date, time, roomId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca agendamentos por sala
   */
  async getByRoom(roomId: number, date?: string, token: string): Promise<ISchedules[]> {
    try {
      const response = await this.api.get<ISchedules[]>(`/schedules/room/${roomId}`, {
        params: date ? { date } : {},
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

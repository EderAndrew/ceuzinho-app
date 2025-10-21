import { BaseService, ServiceResponse } from './BaseService';

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface ToastNotification extends NotificationData {
  id: string;
  timestamp: Date;
  visible: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  scheduleReminders: boolean;
  reminderTime: number; // minutos antes do agendamento
}

/**
 * Serviço de notificações com lógica de negócio robusta
 */
export class NotificationService extends BaseService {
  private notifications: ToastNotification[] = [];
  private settings: NotificationSettings = {
    pushEnabled: true,
    emailEnabled: true,
    scheduleReminders: true,
    reminderTime: 30 // 30 minutos antes
  };

  constructor() {
    super('NotificationService');
  }

  /**
   * Exibe uma notificação toast
   */
  showToast(notification: NotificationData): string {
    const id = this.generateId();
    const toast: ToastNotification = {
      id,
      timestamp: new Date(),
      visible: true,
      ...notification
    };

    this.notifications.push(toast);
    this.log('info', 'Toast exibido', { id, type: notification.type });

    // Auto-remover após duração especificada
    const duration = notification.duration || this.getDefaultDuration(notification.type);
    setTimeout(() => {
      this.hideToast(id);
    }, duration);

    return id;
  }

  /**
   * Oculta uma notificação toast
   */
  hideToast(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].visible = false;
      this.log('info', 'Toast ocultado', { id });
    }
  }

  /**
   * Remove uma notificação toast
   */
  removeToast(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.log('info', 'Toast removido', { id });
    }
  }

  /**
   * Obtém todas as notificações visíveis
   */
  getVisibleNotifications(): ToastNotification[] {
    return this.notifications.filter(n => n.visible);
  }

  /**
   * Limpa todas as notificações
   */
  clearAllNotifications(): void {
    this.notifications = [];
    this.log('info', 'Todas as notificações foram limpas');
  }

  /**
   * Exibe notificação de sucesso
   */
  showSuccess(message: string, title: string = 'Sucesso'): string {
    return this.showToast({
      title,
      message,
      type: 'success',
      duration: 3000
    });
  }

  /**
   * Exibe notificação de erro
   */
  showError(message: string, title: string = 'Erro'): string {
    return this.showToast({
      title,
      message,
      type: 'error',
      duration: 5000
    });
  }

  /**
   * Exibe notificação de aviso
   */
  showWarning(message: string, title: string = 'Atenção'): string {
    return this.showToast({
      title,
      message,
      type: 'warning',
      duration: 4000
    });
  }

  /**
   * Exibe notificação informativa
   */
  showInfo(message: string, title: string = 'Informação'): string {
    return this.showToast({
      title,
      message,
      type: 'info',
      duration: 3000
    });
  }

  /**
   * Agenda notificação push
   */
  async schedulePushNotification(notification: PushNotification): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Agendando notificação push', { 
        id: notification.id, 
        title: notification.title 
      });

      // Validação da notificação
      if (!notification.title || !notification.body) {
        return this.createErrorResponse('Título e corpo da notificação são obrigatórios', 400);
      }

      // Simular agendamento (em produção, seria integrado com serviço de push)
      if (notification.scheduledFor) {
        const delay = notification.scheduledFor.getTime() - Date.now();
        if (delay > 0) {
          setTimeout(() => {
            this.sendPushNotification(notification);
          }, delay);
        }
      } else {
        // Enviar imediatamente
        this.sendPushNotification(notification);
      }

      this.log('info', 'Notificação push agendada', { id: notification.id });
      return this.createSuccessResponse(
        undefined,
        'Notificação agendada com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao agendar notificação push', error);
      return this.handleError(error, 'schedulePushNotification');
    }
  }

  /**
   * Envia notificação push
   */
  private sendPushNotification(notification: PushNotification): void {
    this.log('info', 'Enviando notificação push', { 
      id: notification.id, 
      title: notification.title 
    });

    // Em produção, aqui seria a integração com o serviço de push
    // Por enquanto, apenas log
    console.log('Push Notification:', {
      title: notification.title,
      body: notification.body,
      data: notification.data
    });
  }

  /**
   * Agenda lembretes de agendamentos
   */
  async scheduleScheduleReminder(
    scheduleId: number,
    scheduleDate: string,
    scheduleTime: string,
    title: string
  ): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Agendando lembrete de agendamento', { 
        scheduleId, 
        scheduleDate, 
        scheduleTime 
      });

      if (!this.settings.scheduleReminders) {
        this.log('info', 'Lembretes de agendamento desabilitados');
        return this.createSuccessResponse(undefined, 'Lembretes desabilitados');
      }

      const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      const reminderTime = new Date(scheduleDateTime.getTime() - (this.settings.reminderTime * 60 * 1000));

      // Verificar se o lembrete é no futuro
      if (reminderTime <= new Date()) {
        return this.createErrorResponse('Horário do lembrete deve ser no futuro', 400);
      }

      const notification: PushNotification = {
        id: `schedule_reminder_${scheduleId}`,
        title: 'Lembrete de Agendamento',
        body: `Você tem um agendamento: ${title}`,
        data: { scheduleId, type: 'schedule_reminder' },
        scheduledFor: reminderTime
      };

      await this.schedulePushNotification(notification);

      this.log('info', 'Lembrete de agendamento agendado', { 
        scheduleId, 
        reminderTime: reminderTime.toISOString() 
      });

      return this.createSuccessResponse(
        undefined,
        'Lembrete agendado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao agendar lembrete', error);
      return this.handleError(error, 'scheduleScheduleReminder');
    }
  }

  /**
   * Cancela lembretes de um agendamento
   */
  async cancelScheduleReminders(scheduleId: number): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Cancelando lembretes de agendamento', { scheduleId });

      // Em produção, aqui seria a lógica para cancelar notificações agendadas
      // Por enquanto, apenas log
      this.log('info', 'Lembretes cancelados', { scheduleId });

      return this.createSuccessResponse(
        undefined,
        'Lembretes cancelados com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao cancelar lembretes', error);
      return this.handleError(error, 'cancelScheduleReminders');
    }
  }

  /**
   * Atualiza configurações de notificação
   */
  updateSettings(newSettings: Partial<NotificationSettings>): ServiceResponse<void> {
    try {
      this.log('info', 'Atualizando configurações de notificação', newSettings);

      this.settings = { ...this.settings, ...newSettings };

      this.log('info', 'Configurações atualizadas', this.settings);
      return this.createSuccessResponse(
        undefined,
        'Configurações atualizadas com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao atualizar configurações', error);
      return this.handleError(error, 'updateSettings');
    }
  }

  /**
   * Obtém configurações atuais
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Gera ID único para notificações
   */
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtém duração padrão baseada no tipo
   */
  private getDefaultDuration(type: NotificationData['type']): number {
    switch (type) {
      case 'success':
        return 3000;
      case 'error':
        return 5000;
      case 'warning':
        return 4000;
      case 'info':
      default:
        return 3000;
    }
  }

  /**
   * Limpa notificações antigas (mais de 1 hora)
   */
  cleanupOldNotifications(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.notifications = this.notifications.filter(n => n.timestamp > oneHourAgo);
    this.log('info', 'Notificações antigas removidas');
  }

  /**
   * Obtém estatísticas de notificações
   */
  getNotificationStats(): {
    total: number;
    visible: number;
    byType: Record<string, number>;
  } {
    const stats = {
      total: this.notifications.length,
      visible: this.notifications.filter(n => n.visible).length,
      byType: {} as Record<string, number>
    };

    this.notifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
    });

    return stats;
  }
}

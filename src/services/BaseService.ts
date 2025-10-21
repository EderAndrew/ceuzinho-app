import { ApiError, NetworkError, UnexpectedError } from '@/repositories/BaseRepository';

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedServiceResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

/**
 * Classe base para todos os serviços
 * Fornece funcionalidades comuns como validação, tratamento de erros e formatação de respostas
 */
export abstract class BaseService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Cria uma resposta de sucesso padronizada
   */
  protected createSuccessResponse<T>(
    data: T, 
    message?: string, 
    statusCode: number = 200
  ): ServiceResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Operação realizada com sucesso',
      statusCode
    };
  }

  /**
   * Cria uma resposta de erro padronizada
   */
  protected createErrorResponse(
    error: string, 
    statusCode: number = 500
  ): ServiceResponse {
    return {
      success: false,
      error,
      statusCode
    };
  }

  /**
   * Cria uma resposta paginada de sucesso
   */
  protected createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ): PaginatedServiceResponse<T> {
    return {
      success: true,
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      message: message || 'Dados carregados com sucesso'
    };
  }

  /**
   * Tratamento centralizado de erros
   */
  protected handleError(error: any, context?: string): ServiceResponse {
    const errorContext = context ? `${this.serviceName} - ${context}` : this.serviceName;
    
    if (error instanceof ApiError) {
      console.error(`[${errorContext}] API Error:`, {
        message: error.message,
        status: error.status,
        data: error.data
      });
      
      return this.createErrorResponse(
        error.message,
        error.status
      );
    }
    
    if (error instanceof NetworkError) {
      console.error(`[${errorContext}] Network Error:`, error.message);
      
      return this.createErrorResponse(
        'Erro de conexão. Verifique sua internet e tente novamente.',
        0
      );
    }
    
    if (error instanceof UnexpectedError) {
      console.error(`[${errorContext}] Unexpected Error:`, error.message);
      
      return this.createErrorResponse(
        'Erro inesperado. Tente novamente mais tarde.',
        500
      );
    }

    // Erro genérico não tratado
    console.error(`[${errorContext}] Generic Error:`, error);
    
    return this.createErrorResponse(
      'Erro interno do servidor. Tente novamente mais tarde.',
      500
    );
  }

  /**
   * Validação básica de dados obrigatórios
   */
  protected validateRequiredFields(
    data: Record<string, any>, 
    requiredFields: string[]
  ): ValidationResult {
    const errors: string[] = [];
    
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`Campo '${field}' é obrigatório`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      data: errors.length === 0 ? data : undefined
    };
  }

  /**
   * Validação de email
   */
  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validação de senha
   */
  protected validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validação de data
   */
  protected validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date > new Date();
  }

  /**
   * Validação de horário
   */
  protected validateTime(timeString: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }

  /**
   * Formatação de data para exibição
   */
  protected formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString('pt-BR');
      case 'long':
        return dateObj.toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return dateObj.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return dateObj.toLocaleDateString('pt-BR');
    }
  }

  /**
   * Debounce para operações que podem ser chamadas múltiplas vezes
   */
  protected debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Retry para operações que podem falhar temporariamente
   */
  protected async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Aguarda antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  }

  /**
   * Cache simples em memória
   */
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  protected setCache(key: string, data: any, ttl: number = 300000): void { // 5 minutos por padrão
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  protected getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  protected clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Logging estruturado
   */
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      service: this.serviceName,
      level,
      message,
      data
    };
    
    switch (level) {
      case 'info':
        console.log(`[${timestamp}] [${this.serviceName}] INFO: ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] [${this.serviceName}] WARN: ${message}`, data || '');
        break;
      case 'error':
        console.error(`[${timestamp}] [${this.serviceName}] ERROR: ${message}`, data || '');
        break;
    }
  }
}

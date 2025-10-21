import { AxiosInstance } from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseRepository<T, CreateType = Partial<T>, UpdateType = Partial<T>> {
  protected api: AxiosInstance;
  protected basePath: string;

  constructor(api: AxiosInstance, basePath: string) {
    this.api = api;
    this.basePath = basePath;
  }

  /**
   * Busca todos os registros
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.api.get<PaginatedResponse<T>>(this.basePath, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca um registro por ID
   */
  async getById(id: string | number): Promise<T> {
    try {
      const response = await this.api.get<T>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cria um novo registro
   */
  async create(data: CreateType): Promise<T> {
    try {
      const response = await this.api.post<T>(this.basePath, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Atualiza um registro existente
   */
  async update(id: string | number, data: UpdateType): Promise<T> {
    try {
      const response = await this.api.put<T>(`${this.basePath}/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Atualiza parcialmente um registro existente
   */
  async patch(id: string | number, data: Partial<UpdateType>): Promise<T> {
    try {
      const response = await this.api.patch<T>(`${this.basePath}/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Remove um registro
   */
  async delete(id: string | number): Promise<void> {
    try {
      await this.api.delete(`${this.basePath}/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca registros com filtros customizados
   */
  async findWhere(filters: Record<string, any>, params?: PaginationParams): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.api.get<PaginatedResponse<T>>(this.basePath, {
        params: { ...filters, ...params }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca um único registro com filtros
   */
  async findOne(filters: Record<string, any>): Promise<T | null> {
    try {
      const response = await this.api.get<T[]>(this.basePath, { params: filters });
      return response.data[0] || null;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Tratamento centralizado de erros
   */
  protected handleError(error: any): never {
    if (error.response) {
      // Erro vindo da API (ex: 401, 400, etc.)
      const message = error.response.data?.message || 'Erro desconhecido';
      const status = error.response.status;
      
      throw new ApiError(message, status, error.response.data);
    }
    
    if (error.request) {
      // Requisição foi feita mas não houve resposta
      throw new NetworkError('Sem resposta do servidor. Verifique sua conexão.');
    }
    
    // Erro ao configurar a requisição
    throw new UnexpectedError(`Erro inesperado: ${error.message}`);
  }
}

/**
 * Classes de erro customizadas
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class UnexpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnexpectedError';
  }
}

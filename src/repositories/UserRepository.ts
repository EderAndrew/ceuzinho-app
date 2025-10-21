import { AxiosInstance } from 'axios';
import { BaseRepository, ApiResponse } from './BaseRepository';
import { IUser } from '@/interfaces/IUser';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: IUser;
  message: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
}

export class UserRepository extends BaseRepository<IUser, Partial<IUser>, UpdateProfileData> {
  constructor(api: AxiosInstance) {
    super(api, '/users');
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/users/signin', credentials);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca dados do usuário logado
   */
  async getCurrentUser(token: string): Promise<IUser> {
    try {
      const response = await this.api.get<IUser>('/users/me', {
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
   * Altera senha do usuário
   */
  async changePassword(data: ChangePasswordData, token: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.put<ApiResponse<void>>('/users/change-password', data, {
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
   * Atualiza perfil do usuário
   */
  async updateProfile(data: UpdateProfileData, token: string): Promise<IUser> {
    try {
      const response = await this.api.put<IUser>('/users/profile', data, {
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
   * Upload de foto do usuário
   */
  async uploadPhoto(photoUri: string, token: string): Promise<ApiResponse<{ photoUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await this.api.post<ApiResponse<{ photoUrl: string }>>('/users/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Busca usuários por role
   */
  async getUsersByRole(role: string, token: string): Promise<IUser[]> {
    try {
      const response = await this.api.get<IUser[]>(`/users/role/${role}`, {
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
   * Ativa/desativa usuário
   */
  async toggleUserStatus(userId: number, status: boolean, token: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.api.patch<ApiResponse<void>>(`/users/${userId}/status`, 
        { status }, 
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
   * Busca usuários com filtros avançados
   */
  async searchUsers(filters: {
    name?: string;
    email?: string;
    role?: string;
    status?: boolean;
  }, token: string): Promise<IUser[]> {
    try {
      const response = await this.api.get<IUser[]>('/users/search', {
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
}

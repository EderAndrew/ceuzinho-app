import { BaseService, ServiceResponse } from './BaseService';
import { UserRepository } from '@/repositories/UserRepository';
import { IUser } from '@/interfaces/IUser';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  user: IUser;
  token: string;
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

export interface AuthSession {
  user: IUser;
  token: string;
  isAuthenticated: boolean;
  lastActivity: Date;
}

/**
 * Serviço de autenticação com lógica de negócio robusta
 */
export class AuthService extends BaseService {
  private userRepository: UserRepository;
  private sessionCache: AuthSession | null = null;
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas

  constructor(userRepository: UserRepository) {
    super('AuthService');
    this.userRepository = userRepository;
  }

  /**
   * Realiza login do usuário com validações robustas
   */
  async login(credentials: LoginCredentials): Promise<ServiceResponse<LoginResult>> {
    try {
      this.log('info', 'Iniciando processo de login', { email: credentials.email });

      // Validação dos dados de entrada
      const validation = this.validateRequiredFields(credentials, ['email', 'password']);
      if (!validation.isValid) {
        return this.createErrorResponse(
          `Dados inválidos: ${validation.errors.join(', ')}`,
          400
        );
      }

      // Validação de email
      if (!this.validateEmail(credentials.email)) {
        return this.createErrorResponse('Email inválido', 400);
      }

      // Validação de senha
      if (credentials.password.length < 6) {
        return this.createErrorResponse('Senha deve ter pelo menos 6 caracteres', 400);
      }

      // Tentativa de login com retry
      const loginResult = await this.retry(
        () => this.userRepository.login(credentials),
        3,
        1000
      );

      // Criar sessão
      const session: AuthSession = {
        user: loginResult.user,
        token: loginResult.token,
        isAuthenticated: true,
        lastActivity: new Date()
      };

      this.sessionCache = session;
      this.setCache('auth_session', session, this.SESSION_TIMEOUT);

      this.log('info', 'Login realizado com sucesso', { 
        userId: loginResult.user.id,
        email: loginResult.user.email 
      });

      return this.createSuccessResponse(
        {
          user: loginResult.user,
          token: loginResult.token,
          message: loginResult.message
        },
        'Login realizado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro durante login', error);
      return this.handleError(error, 'login');
    }
  }

  /**
   * Busca dados do usuário logado com cache
   */
  async getCurrentUser(token: string): Promise<ServiceResponse<IUser>> {
    try {
      // Verificar cache primeiro
      const cachedSession = this.getCache<AuthSession>('auth_session');
      if (cachedSession && cachedSession.token === token) {
        this.log('info', 'Usuário carregado do cache');
        return this.createSuccessResponse(cachedSession.user);
      }

      // Buscar do servidor
      const user = await this.userRepository.getCurrentUser(token);
      
      // Atualizar cache
      if (this.sessionCache) {
        this.sessionCache.user = user;
        this.setCache('auth_session', this.sessionCache, this.SESSION_TIMEOUT);
      }

      this.log('info', 'Dados do usuário carregados', { userId: user.id });
      return this.createSuccessResponse(user);

    } catch (error) {
      this.log('error', 'Erro ao buscar dados do usuário', error);
      return this.handleError(error, 'getCurrentUser');
    }
  }

  /**
   * Altera senha do usuário com validações robustas
   */
  async changePassword(
    data: ChangePasswordData, 
    token: string
  ): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Iniciando alteração de senha');

      // Validação dos dados
      const validation = this.validateRequiredFields(data, [
        'currentPassword', 
        'newPassword', 
        'confirmPassword'
      ]);
      
      if (!validation.isValid) {
        return this.createErrorResponse(
          `Dados inválidos: ${validation.errors.join(', ')}`,
          400
        );
      }

      // Validação da nova senha
      const passwordValidation = this.validatePassword(data.newPassword);
      if (!passwordValidation.isValid) {
        return this.createErrorResponse(
          `Nova senha inválida: ${passwordValidation.errors.join(', ')}`,
          400
        );
      }

      // Verificar se as senhas coincidem
      if (data.newPassword !== data.confirmPassword) {
        return this.createErrorResponse('As senhas não coincidem', 400);
      }

      // Verificar se a nova senha é diferente da atual
      if (data.currentPassword === data.newPassword) {
        return this.createErrorResponse('A nova senha deve ser diferente da atual', 400);
      }

      // Realizar alteração
      await this.userRepository.changePassword(data, token);

      // Limpar cache de sessão
      this.clearCache('auth_session');
      this.sessionCache = null;

      this.log('info', 'Senha alterada com sucesso');
      return this.createSuccessResponse(
        undefined,
        'Senha alterada com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao alterar senha', error);
      return this.handleError(error, 'changePassword');
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  async updateProfile(
    data: UpdateProfileData, 
    token: string
  ): Promise<ServiceResponse<IUser>> {
    try {
      this.log('info', 'Iniciando atualização de perfil');

      // Validação de email se fornecido
      if (data.email && !this.validateEmail(data.email)) {
        return this.createErrorResponse('Email inválido', 400);
      }

      // Validação de telefone se fornecido
      if (data.phone && !this.validatePhone(data.phone)) {
        return this.createErrorResponse('Telefone inválido', 400);
      }

      // Atualizar perfil
      const updatedUser = await this.userRepository.updateProfile(data, token);

      // Atualizar cache
      if (this.sessionCache) {
        this.sessionCache.user = updatedUser;
        this.setCache('auth_session', this.sessionCache, this.SESSION_TIMEOUT);
      }

      this.log('info', 'Perfil atualizado com sucesso', { userId: updatedUser.id });
      return this.createSuccessResponse(
        updatedUser,
        'Perfil atualizado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao atualizar perfil', error);
      return this.handleError(error, 'updateProfile');
    }
  }

  /**
   * Upload de foto do usuário
   */
  async uploadPhoto(photoUri: string, token: string): Promise<ServiceResponse<{ photoUrl: string }>> {
    try {
      this.log('info', 'Iniciando upload de foto');

      // Validação básica do arquivo
      if (!photoUri || photoUri.trim() === '') {
        return this.createErrorResponse('URI da foto é obrigatória', 400);
      }

      // Upload da foto
      const result = await this.userRepository.uploadPhoto(photoUri, token);

      this.log('info', 'Foto enviada com sucesso');
      return this.createSuccessResponse(
        { photoUrl: result.data.photoUrl },
        'Foto enviada com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao enviar foto', error);
      return this.handleError(error, 'uploadPhoto');
    }
  }

  /**
   * Realiza logout do usuário
   */
  async logout(): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Realizando logout');

      // Limpar cache e sessão
      this.clearCache();
      this.sessionCache = null;

      this.log('info', 'Logout realizado com sucesso');
      return this.createSuccessResponse(
        undefined,
        'Logout realizado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro durante logout', error);
      return this.handleError(error, 'logout');
    }
  }

  /**
   * Verifica se a sessão está válida
   */
  isSessionValid(): boolean {
    if (!this.sessionCache) {
      return false;
    }

    const now = new Date();
    const timeDiff = now.getTime() - this.sessionCache.lastActivity.getTime();
    
    return timeDiff < this.SESSION_TIMEOUT;
  }

  /**
   * Atualiza atividade da sessão
   */
  updateSessionActivity(): void {
    if (this.sessionCache) {
      this.sessionCache.lastActivity = new Date();
      this.setCache('auth_session', this.sessionCache, this.SESSION_TIMEOUT);
    }
  }

  /**
   * Obtém dados da sessão atual
   */
  getCurrentSession(): AuthSession | null {
    return this.sessionCache;
  }

  /**
   * Validação de telefone brasileiro
   */
  private validatePhone(phone: string): boolean {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem 10 ou 11 dígitos (com DDD)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }

  /**
   * Verifica se o usuário tem permissão para uma ação
   */
  hasPermission(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = {
      'USER': 1,
      'ADMIN': 2,
      'SUPER_ADMIN': 3
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }

  /**
   * Gera token de recuperação de senha (simulado)
   */
  async generatePasswordResetToken(email: string): Promise<ServiceResponse<{ token: string }>> {
    try {
      this.log('info', 'Gerando token de recuperação', { email });

      if (!this.validateEmail(email)) {
        return this.createErrorResponse('Email inválido', 400);
      }

      // Simular geração de token (em produção, seria enviado por email)
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);

      this.log('info', 'Token de recuperação gerado', { email });
      return this.createSuccessResponse(
        { token: resetToken },
        'Token de recuperação gerado. Verifique seu email.'
      );

    } catch (error) {
      this.log('error', 'Erro ao gerar token de recuperação', error);
      return this.handleError(error, 'generatePasswordResetToken');
    }
  }
}

import { BaseService, ServiceResponse, PaginatedServiceResponse } from './BaseService';
import { UserRepository } from '@/repositories/UserRepository';
import { IUser } from '@/interfaces/IUser';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  sex: string;
  bgColor?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  bgColor?: string;
  status?: boolean;
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}

/**
 * Serviço de usuários com lógica de negócio robusta
 */
export class UserService extends BaseService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super('UserService');
    this.userRepository = userRepository;
  }

  /**
   * Busca todos os usuários com paginação e filtros
   */
  async getUsers(
    filters: UserFilters = {}, 
    token: string
  ): Promise<PaginatedServiceResponse<IUser>> {
    try {
      this.log('info', 'Buscando usuários', filters);

      // Verificar cache
      const cacheKey = `users_${JSON.stringify(filters)}`;
      const cachedUsers = this.getCache<PaginatedServiceResponse<IUser>>(cacheKey);
      if (cachedUsers) {
        this.log('info', 'Usuários carregados do cache');
        return cachedUsers;
      }

      // Buscar do repositório
      const result = await this.userRepository.getAll({
        page: filters.page || 1,
        limit: filters.limit || 10,
        sortBy: 'name',
        sortOrder: 'asc'
      });

      // Aplicar filtros locais se necessário
      let filteredUsers = result.data;
      if (filters.name || filters.email || filters.role || filters.status !== undefined) {
        filteredUsers = this.applyUserFilters(result.data, filters);
      }

      const response = this.createPaginatedResponse(
        filteredUsers,
        filteredUsers.length,
        filters.page || 1,
        filters.limit || 10,
        'Usuários carregados com sucesso'
      );

      // Cache por 5 minutos
      this.setCache(cacheKey, response, 300000);

      this.log('info', 'Usuários carregados', { count: filteredUsers.length });
      return response;

    } catch (error) {
      this.log('error', 'Erro ao buscar usuários', error);
      return this.handleError(error, 'getUsers') as PaginatedServiceResponse<IUser>;
    }
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: number, token: string): Promise<ServiceResponse<IUser>> {
    try {
      this.log('info', 'Buscando usuário por ID', { id });

      // Verificar cache
      const cacheKey = `user_${id}`;
      const cachedUser = this.getCache<IUser>(cacheKey);
      if (cachedUser) {
        this.log('info', 'Usuário carregado do cache');
        return this.createSuccessResponse(cachedUser);
      }

      // Buscar do repositório
      const user = await this.userRepository.getById(id);

      // Cache por 10 minutos
      this.setCache(cacheKey, user, 600000);

      this.log('info', 'Usuário carregado', { id, name: user.name });
      return this.createSuccessResponse(user);

    } catch (error) {
      this.log('error', 'Erro ao buscar usuário', error);
      return this.handleError(error, 'getUserById');
    }
  }

  /**
   * Cria um novo usuário
   */
  async createUser(data: CreateUserData, token: string): Promise<ServiceResponse<IUser>> {
    try {
      this.log('info', 'Criando novo usuário', { email: data.email, role: data.role });

      // Validação dos dados obrigatórios
      const validation = this.validateRequiredFields(data, [
        'name', 'email', 'password', 'role', 'sex'
      ]);
      
      if (!validation.isValid) {
        return this.createErrorResponse(
          `Dados inválidos: ${validation.errors.join(', ')}`,
          400
        );
      }

      // Validação de email
      if (!this.validateEmail(data.email)) {
        return this.createErrorResponse('Email inválido', 400);
      }

      // Validação de senha
      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return this.createErrorResponse(
          `Senha inválida: ${passwordValidation.errors.join(', ')}`,
          400
        );
      }

      // Validação de telefone se fornecido
      if (data.phone && !this.validatePhone(data.phone)) {
        return this.createErrorResponse('Telefone inválido', 400);
      }

      // Validação de role
      if (!this.isValidRole(data.role)) {
        return this.createErrorResponse('Role inválida', 400);
      }

      // Criar usuário
      const user = await this.userRepository.create({
        ...data,
        status: true,
        firstAccess: true,
        createdAt: new Date().toISOString()
      });

      // Limpar cache
      this.clearCache('users_');

      this.log('info', 'Usuário criado com sucesso', { id: user.id, email: user.email });
      return this.createSuccessResponse(
        user,
        'Usuário criado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao criar usuário', error);
      return this.handleError(error, 'createUser');
    }
  }

  /**
   * Atualiza um usuário existente
   */
  async updateUser(
    id: number, 
    data: UpdateUserData, 
    token: string
  ): Promise<ServiceResponse<IUser>> {
    try {
      this.log('info', 'Atualizando usuário', { id });

      // Validação de email se fornecido
      if (data.email && !this.validateEmail(data.email)) {
        return this.createErrorResponse('Email inválido', 400);
      }

      // Validação de telefone se fornecido
      if (data.phone && !this.validatePhone(data.phone)) {
        return this.createErrorResponse('Telefone inválido', 400);
      }

      // Atualizar usuário
      const updatedUser = await this.userRepository.update(id, data);

      // Limpar cache
      this.clearCache(`user_${id}`);
      this.clearCache('users_');

      this.log('info', 'Usuário atualizado com sucesso', { id });
      return this.createSuccessResponse(
        updatedUser,
        'Usuário atualizado com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao atualizar usuário', error);
      return this.handleError(error, 'updateUser');
    }
  }

  /**
   * Remove um usuário
   */
  async deleteUser(id: number, token: string): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Removendo usuário', { id });

      await this.userRepository.delete(id);

      // Limpar cache
      this.clearCache(`user_${id}`);
      this.clearCache('users_');

      this.log('info', 'Usuário removido com sucesso', { id });
      return this.createSuccessResponse(
        undefined,
        'Usuário removido com sucesso'
      );

    } catch (error) {
      this.log('error', 'Erro ao remover usuário', error);
      return this.handleError(error, 'deleteUser');
    }
  }

  /**
   * Busca usuários por role
   */
  async getUsersByRole(
    role: string, 
    token: string
  ): Promise<ServiceResponse<IUser[]>> {
    try {
      this.log('info', 'Buscando usuários por role', { role });

      if (!this.isValidRole(role)) {
        return this.createErrorResponse('Role inválida', 400);
      }

      // Verificar cache
      const cacheKey = `users_role_${role}`;
      const cachedUsers = this.getCache<IUser[]>(cacheKey);
      if (cachedUsers) {
        this.log('info', 'Usuários por role carregados do cache');
        return this.createSuccessResponse(cachedUsers);
      }

      // Buscar do repositório
      const users = await this.userRepository.getUsersByRole(role, token);

      // Cache por 5 minutos
      this.setCache(cacheKey, users, 300000);

      this.log('info', 'Usuários por role carregados', { count: users.length });
      return this.createSuccessResponse(users);

    } catch (error) {
      this.log('error', 'Erro ao buscar usuários por role', error);
      return this.handleError(error, 'getUsersByRole');
    }
  }

  /**
   * Busca usuários com filtros avançados
   */
  async searchUsers(
    filters: UserFilters, 
    token: string
  ): Promise<ServiceResponse<IUser[]>> {
    try {
      this.log('info', 'Buscando usuários com filtros', filters);

      const users = await this.userRepository.searchUsers({
        name: filters.name,
        email: filters.email,
        role: filters.role,
        status: filters.status
      }, token);

      this.log('info', 'Usuários encontrados', { count: users.length });
      return this.createSuccessResponse(users);

    } catch (error) {
      this.log('error', 'Erro ao buscar usuários', error);
      return this.handleError(error, 'searchUsers');
    }
  }

  /**
   * Ativa/desativa um usuário
   */
  async toggleUserStatus(
    id: number, 
    status: boolean, 
    token: string
  ): Promise<ServiceResponse<void>> {
    try {
      this.log('info', 'Alterando status do usuário', { id, status });

      await this.userRepository.toggleUserStatus(id, status, token);

      // Limpar cache
      this.clearCache(`user_${id}`);
      this.clearCache('users_');

      this.log('info', 'Status do usuário alterado com sucesso', { id, status });
      return this.createSuccessResponse(
        undefined,
        `Usuário ${status ? 'ativado' : 'desativado'} com sucesso`
      );

    } catch (error) {
      this.log('error', 'Erro ao alterar status do usuário', error);
      return this.handleError(error, 'toggleUserStatus');
    }
  }

  /**
   * Busca estatísticas de usuários
   */
  async getUserStats(token: string): Promise<ServiceResponse<UserStats>> {
    try {
      this.log('info', 'Buscando estatísticas de usuários');

      // Verificar cache
      const cacheKey = 'user_stats';
      const cachedStats = this.getCache<UserStats>(cacheKey);
      if (cachedStats) {
        this.log('info', 'Estatísticas carregadas do cache');
        return this.createSuccessResponse(cachedStats);
      }

      // Buscar todos os usuários para calcular estatísticas
      const users = await this.userRepository.getAll();
      
      const stats: UserStats = {
        total: users.data.length,
        active: users.data.filter(user => user.status).length,
        inactive: users.data.filter(user => !user.status).length,
        byRole: {}
      };

      // Calcular por role
      users.data.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
      });

      // Cache por 10 minutos
      this.setCache(cacheKey, stats, 600000);

      this.log('info', 'Estatísticas calculadas', stats);
      return this.createSuccessResponse(stats);

    } catch (error) {
      this.log('error', 'Erro ao buscar estatísticas', error);
      return this.handleError(error, 'getUserStats');
    }
  }

  /**
   * Aplica filtros locais aos usuários
   */
  private applyUserFilters(users: IUser[], filters: UserFilters): IUser[] {
    return users.filter(user => {
      if (filters.name && !user.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      if (filters.role && user.role !== filters.role) {
        return false;
      }
      if (filters.status !== undefined && user.status !== filters.status) {
        return false;
      }
      return true;
    });
  }

  /**
   * Validação de telefone brasileiro
   */
  private validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }

  /**
   * Validação de role
   */
  private isValidRole(role: string): boolean {
    const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    return validRoles.includes(role.toUpperCase());
  }

  /**
   * Verifica se um usuário pode ser editado
   */
  canEditUser(currentUser: IUser, targetUser: IUser): boolean {
    // Super admin pode editar qualquer um
    if (currentUser.role === 'SUPER_ADMIN') {
      return true;
    }

    // Admin pode editar usuários comuns, mas não outros admins
    if (currentUser.role === 'ADMIN') {
      return targetUser.role === 'USER';
    }

    // Usuário comum só pode editar a si mesmo
    return currentUser.id === targetUser.id;
  }

  /**
   * Verifica se um usuário pode ser removido
   */
  canDeleteUser(currentUser: IUser, targetUser: IUser): boolean {
    // Não pode remover a si mesmo
    if (currentUser.id === targetUser.id) {
      return false;
    }

    // Super admin pode remover qualquer um
    if (currentUser.role === 'SUPER_ADMIN') {
      return true;
    }

    // Admin pode remover usuários comuns
    if (currentUser.role === 'ADMIN') {
      return targetUser.role === 'USER';
    }

    return false;
  }
}

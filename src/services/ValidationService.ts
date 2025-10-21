import { BaseService, ServiceResponse } from './BaseService';

export interface ValidationRule {
  field: string;
  rules: string[];
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  data?: any;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

/**
 * Serviço de validação com lógica de negócio robusta
 */
export class ValidationService extends BaseService {
  private validationRules: Map<string, FieldValidation[]> = new Map();

  constructor() {
    super('ValidationService');
    this.initializeDefaultRules();
  }

  /**
   * Inicializa regras de validação padrão
   */
  private initializeDefaultRules(): void {
    // Regras para email
    this.addValidationRule('email', {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email deve ter um formato válido'
    });

    // Regras para senha
    this.addValidationRule('password', {
      required: true,
      minLength: 6,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Senha deve ter pelo menos 6 caracteres, incluindo maiúscula, minúscula e número'
    });

    // Regras para nome
    this.addValidationRule('name', {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      message: 'Nome deve conter apenas letras e espaços'
    });

    // Regras para telefone brasileiro
    this.addValidationRule('phone', {
      required: false,
      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      message: 'Telefone deve estar no formato (XX) XXXXX-XXXX'
    });

    // Regras para data
    this.addValidationRule('date', {
      required: true,
      custom: (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date > new Date();
      },
      message: 'Data deve ser válida e futura'
    });

    // Regras para horário
    this.addValidationRule('time', {
      required: true,
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Horário deve estar no formato HH:MM'
    });
  }

  /**
   * Adiciona regra de validação para um campo
   */
  addValidationRule(field: string, rule: FieldValidation): void {
    if (!this.validationRules.has(field)) {
      this.validationRules.set(field, []);
    }
    this.validationRules.get(field)!.push(rule);
  }

  /**
   * Valida um objeto com base nas regras definidas
   */
  validate(data: Record<string, any>, fields?: string[]): ValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    this.log('info', 'Iniciando validação', { fields: fields || 'all' });

    // Se campos específicos foram fornecidos, validar apenas eles
    const fieldsToValidate = fields || Array.from(this.validationRules.keys());

    for (const field of fieldsToValidate) {
      const fieldErrors = this.validateField(field, data[field]);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }

    this.log('info', 'Validação concluída', { 
      isValid, 
      errorCount: Object.keys(errors).length 
    });

    return {
      isValid,
      errors,
      data: isValid ? data : undefined
    };
  }

  /**
   * Valida um campo específico
   */
  validateField(field: string, value: any): string[] {
    const rules = this.validationRules.get(field);
    if (!rules) {
      return [];
    }

    const errors: string[] = [];

    for (const rule of rules) {
      const error = this.validateRule(rule, value);
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  /**
   * Valida uma regra específica
   */
  private validateRule(rule: FieldValidation, value: any): string | null {
    // Verificar se é obrigatório
    if (rule.required && (value === undefined || value === null || value === '')) {
      return rule.message || 'Campo é obrigatório';
    }

    // Se o valor está vazio e não é obrigatório, pular outras validações
    if (!value && !rule.required) {
      return null;
    }

    // Verificar comprimento mínimo
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return rule.message || `Deve ter pelo menos ${rule.minLength} caracteres`;
    }

    // Verificar comprimento máximo
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message || `Deve ter no máximo ${rule.maxLength} caracteres`;
    }

    // Verificar padrão regex
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || 'Formato inválido';
    }

    // Verificar validação customizada
    if (rule.custom && !rule.custom(value)) {
      return rule.message || 'Valor inválido';
    }

    return null;
  }

  /**
   * Validação específica para login
   */
  validateLogin(data: { email: string; password: string }): ValidationResult {
    return this.validate(data, ['email', 'password']);
  }

  /**
   * Validação específica para criação de usuário
   */
  validateUserCreation(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    sex: string;
  }): ValidationResult {
    const result = this.validate(data, ['name', 'email', 'password', 'phone']);

    // Validação adicional para role
    const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(data.role)) {
      result.isValid = false;
      result.errors.role = ['Role deve ser USER, ADMIN ou SUPER_ADMIN'];
    }

    // Validação adicional para sex
    const validSexes = ['M', 'F', 'O'];
    if (!validSexes.includes(data.sex)) {
      result.isValid = false;
      result.errors.sex = ['Sexo deve ser M, F ou O'];
    }

    return result;
  }

  /**
   * Validação específica para agendamento
   */
  validateSchedule(data: {
    title: string;
    date: string;
    time: string;
    roomId: number;
    userId: number;
  }): ValidationResult {
    const result = this.validate(data, ['date', 'time']);

    // Validação do título
    if (!data.title || data.title.trim().length < 3) {
      result.isValid = false;
      result.errors.title = ['Título deve ter pelo menos 3 caracteres'];
    }

    // Validação dos IDs
    if (!data.roomId || data.roomId <= 0) {
      result.isValid = false;
      result.errors.roomId = ['ID da sala deve ser válido'];
    }

    if (!data.userId || data.userId <= 0) {
      result.isValid = false;
      result.errors.userId = ['ID do usuário deve ser válido'];
    }

    return result;
  }

  /**
   * Validação específica para alteração de senha
   */
  validatePasswordChange(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): ValidationResult {
    const result = this.validate(data, ['password']);

    // Renomear o campo para newPassword
    if (result.errors.password) {
      result.errors.newPassword = result.errors.password;
      delete result.errors.password;
    }

    // Verificar se as senhas coincidem
    if (data.newPassword !== data.confirmPassword) {
      result.isValid = false;
      result.errors.confirmPassword = ['As senhas não coincidem'];
    }

    // Verificar se a nova senha é diferente da atual
    if (data.currentPassword === data.newPassword) {
      result.isValid = false;
      result.errors.newPassword = ['A nova senha deve ser diferente da atual'];
    }

    return result;
  }

  /**
   * Validação de email com verificação de domínio
   */
  validateEmailWithDomain(email: string, allowedDomains?: string[]): ValidationResult {
    const basicValidation = this.validate({ email }, ['email']);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    if (allowedDomains && allowedDomains.length > 0) {
      const domain = email.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        return {
          isValid: false,
          errors: {
            email: [`Email deve ser de um dos domínios: ${allowedDomains.join(', ')}`]
          }
        };
      }
    }

    return { isValid: true, errors: {} };
  }

  /**
   * Validação de CPF brasileiro
   */
  validateCPF(cpf: string): ValidationResult {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');

    // Verificar se tem 11 dígitos
    if (cleanCPF.length !== 11) {
      return {
        isValid: false,
        errors: { cpf: ['CPF deve ter 11 dígitos'] }
      };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return {
        isValid: false,
        errors: { cpf: ['CPF inválido'] }
      };
    }

    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) {
      return {
        isValid: false,
        errors: { cpf: ['CPF inválido'] }
      };
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) {
      return {
        isValid: false,
        errors: { cpf: ['CPF inválido'] }
      };
    }

    return { isValid: true, errors: {} };
  }

  /**
   * Validação de CNPJ brasileiro
   */
  validateCNPJ(cnpj: string): ValidationResult {
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/\D/g, '');

    // Verificar se tem 14 dígitos
    if (cleanCNPJ.length !== 14) {
      return {
        isValid: false,
        errors: { cnpj: ['CNPJ deve ter 14 dígitos'] }
      };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
      return {
        isValid: false,
        errors: { cnpj: ['CNPJ inválido'] }
      };
    }

    // Validar dígitos verificadores
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cleanCNPJ.charAt(12))) {
      return {
        isValid: false,
        errors: { cnpj: ['CNPJ inválido'] }
      };
    }

    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cleanCNPJ.charAt(13))) {
      return {
        isValid: false,
        errors: { cnpj: ['CNPJ inválido'] }
      };
    }

    return { isValid: true, errors: {} };
  }

  /**
   * Sanitiza dados removendo caracteres perigosos
   */
  sanitizeData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Remove tags HTML e caracteres perigosos
        sanitized[key] = value
          .replace(/<[^>]*>/g, '') // Remove tags HTML
          .replace(/[<>]/g, '') // Remove < e >
          .trim();
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Obtém mensagens de erro formatadas
   */
  formatErrors(errors: Record<string, string[]>): string[] {
    const formattedErrors: string[] = [];

    for (const [field, fieldErrors] of Object.entries(errors)) {
      for (const error of fieldErrors) {
        formattedErrors.push(`${field}: ${error}`);
      }
    }

    return formattedErrors;
  }
}

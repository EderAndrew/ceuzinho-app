# Camada de Serviços - Documentação

Esta camada implementa serviços robustos com lógica de negócio, validações e tratamento de erros centralizado.

## 📁 Estrutura

```
src/services/
├── BaseService.ts           # Classe base com funcionalidades comuns
├── AuthService.ts           # Serviço de autenticação
├── ScheduleService.ts       # Serviço de agendamentos
├── UserService.ts           # Serviço de usuários
├── NotificationService.ts   # Serviço de notificações
├── ValidationService.ts     # Serviço de validação
├── ServiceFactory.ts        # Factory para gerenciar instâncias
├── index.ts                 # Exportações centralizadas
└── README.md                # Esta documentação
```

## 🚀 Como Usar

### 1. Importação Básica

```typescript
import { useServices } from '@/hooks/useServices';

const MyComponent = () => {
  const { auth, schedule, user, notification, validation } = useServices();
  // ... resto do componente
};
```

### 2. Usando Serviços Específicos

```typescript
import { useAuthService, useScheduleService } from '@/hooks/useServices';

const MyComponent = () => {
  const authService = useAuthService();
  const scheduleService = useScheduleService();
  
  const handleLogin = async (credentials) => {
    const result = await authService.login(credentials);
    if (result.success) {
      // Login bem-sucedido
    }
  };
};
```

## 🔧 Serviços Disponíveis

### AuthService - Autenticação

**Funcionalidades:**
- Login com validações robustas
- Gerenciamento de sessão
- Alteração de senha
- Atualização de perfil
- Upload de foto
- Verificação de permissões

**Exemplo:**
```typescript
const authService = useAuthService();

// Login
const loginResult = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Alterar senha
const changePasswordResult = await authService.changePassword({
  currentPassword: 'old123',
  newPassword: 'new123',
  confirmPassword: 'new123'
}, token);
```

### ScheduleService - Agendamentos

**Funcionalidades:**
- Criação de agendamentos com validações
- Busca por data, mês, usuário
- Verificação de disponibilidade
- Atualização e remoção
- Estatísticas de agendamentos
- Cache inteligente

**Exemplo:**
```typescript
const scheduleService = useScheduleService();

// Criar agendamento
const createResult = await scheduleService.createSchedule({
  title: 'Reunião',
  date: '2024-12-25',
  time: '14:00',
  roomId: 1,
  userId: 1
}, token);

// Verificar disponibilidade
const availability = await scheduleService.checkAvailability(
  '2024-12-25', '14:00', 1, token
);
```

### UserService - Usuários

**Funcionalidades:**
- CRUD completo de usuários
- Busca com filtros avançados
- Paginação automática
- Estatísticas de usuários
- Validação de permissões

**Exemplo:**
```typescript
const userService = useUserService();

// Buscar usuários com filtros
const usersResult = await userService.getUsers({
  name: 'João',
  role: 'USER',
  status: true,
  page: 1,
  limit: 10
}, token);

// Criar usuário
const createResult = await userService.createUser({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'password123',
  role: 'USER',
  sex: 'M'
}, token);
```

### NotificationService - Notificações

**Funcionalidades:**
- Notificações toast
- Notificações push
- Lembretes de agendamentos
- Configurações personalizáveis
- Cache de notificações

**Exemplo:**
```typescript
const notificationService = useNotificationService();

// Exibir notificação
notificationService.showSuccess('Operação realizada!');
notificationService.showError('Erro na operação');

// Agendar lembrete
await notificationService.scheduleScheduleReminder(
  scheduleId, '2024-12-25', '14:00', 'Reunião'
);
```

### ValidationService - Validação

**Funcionalidades:**
- Validação de formulários
- Validação de CPF/CNPJ
- Validação de email com domínio
- Sanitização de dados
- Regras customizáveis

**Exemplo:**
```typescript
const validationService = useValidationService();

// Validar login
const loginValidation = validationService.validateLogin({
  email: 'user@example.com',
  password: 'password123'
});

// Validar CPF
const cpfValidation = validationService.validateCPF('12345678901');

// Validar agendamento
const scheduleValidation = validationService.validateSchedule({
  title: 'Reunião',
  date: '2024-12-25',
  time: '14:00',
  roomId: 1,
  userId: 1
});
```

## 🛡️ Tratamento de Erros

Todos os serviços retornam respostas padronizadas:

```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
```

**Exemplo de uso:**
```typescript
const result = await authService.login(credentials);

if (result.success) {
  // Operação bem-sucedida
  console.log('Dados:', result.data);
  console.log('Mensagem:', result.message);
} else {
  // Tratar erro
  console.error('Erro:', result.error);
  console.error('Status:', result.statusCode);
}
```

## 📊 Cache e Performance

### Cache Automático
- **AuthService**: Cache de sessão (24h)
- **ScheduleService**: Cache de agendamentos (5-10min)
- **UserService**: Cache de usuários (5-10min)

### Limpeza de Cache
```typescript
// Limpar cache específico
authService.clearCache('auth_session');

// Limpar todo cache
scheduleService.clearCache();
```

## 🔄 Retry e Debounce

### Retry Automático
```typescript
// Operações com retry automático (3 tentativas)
const result = await authService.login(credentials);
```

### Debounce
```typescript
// Operações com debounce (evita múltiplas chamadas)
const debouncedSearch = authService.debounce(searchFunction, 500);
```

## 🧪 Testes

### Mock de Serviços
```typescript
// __tests__/MyComponent.test.tsx
jest.mock('@/hooks/useServices', () => ({
  useServices: () => ({
    auth: {
      login: jest.fn().mockResolvedValue({
        success: true,
        data: { user: mockUser, token: 'mock-token' }
      })
    },
    notification: {
      showSuccess: jest.fn(),
      showError: jest.fn()
    }
  })
}));
```

## 📈 Monitoramento

### Logs Estruturados
Todos os serviços incluem logging estruturado:

```typescript
// Logs automáticos
authService.log('info', 'Login realizado', { userId: 123 });
scheduleService.log('error', 'Erro ao criar agendamento', error);
```

### Estatísticas
```typescript
// Obter estatísticas dos serviços
const stats = ServiceFactory.getServicesStats();
console.log('Serviços inicializados:', stats.initialized);
```

## 🎯 Benefícios

1. **Separação de Responsabilidades**: Lógica de negócio isolada
2. **Validação Robusta**: Validações centralizadas e reutilizáveis
3. **Tratamento de Erros**: Padronizado e consistente
4. **Cache Inteligente**: Performance otimizada
5. **Logging Estruturado**: Debugging facilitado
6. **Testabilidade**: Fácil de mockar e testar
7. **Reutilização**: Código compartilhado entre componentes
8. **Tipagem Completa**: TypeScript com IntelliSense

## 🔧 Configuração

### Configurações de Notificação
```typescript
const notificationService = useNotificationService();

// Atualizar configurações
notificationService.updateSettings({
  pushEnabled: true,
  emailEnabled: false,
  scheduleReminders: true,
  reminderTime: 60 // 60 minutos antes
});
```

### Regras de Validação Customizadas
```typescript
const validationService = useValidationService();

// Adicionar regra customizada
validationService.addValidationRule('customField', {
  required: true,
  minLength: 5,
  custom: (value) => value.includes('custom'),
  message: 'Campo deve conter "custom"'
});
```

## 📝 Exemplo Completo

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useServices } from '@/hooks/useServices';

export const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const { auth, schedule, notification, validation } = useServices();

  const handleCreateSchedule = async (data) => {
    setLoading(true);
    
    try {
      // 1. Validar dados
      const validationResult = validation.validateSchedule(data);
      if (!validationResult.isValid) {
        const errors = validation.formatErrors(validationResult.errors);
        Alert.alert('Dados inválidos', errors.join('\n'));
        return;
      }

      // 2. Verificar disponibilidade
      const availability = await schedule.checkAvailability(
        data.date, data.time, data.roomId, token
      );
      
      if (!availability.available) {
        notification.showWarning(availability.message || 'Horário não disponível');
        return;
      }

      // 3. Criar agendamento
      const result = await schedule.createSchedule(data, token);
      
      if (result.success) {
        notification.showSuccess('Agendamento criado com sucesso!');
        
        // 4. Agendar lembrete
        await notification.scheduleScheduleReminder(
          result.data.id, data.date, data.time, data.title
        );
      } else {
        notification.showError(result.error || 'Erro ao criar agendamento');
      }
    } catch (error) {
      notification.showError('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={() => handleCreateSchedule(scheduleData)}
        disabled={loading}
      >
        <Text>{loading ? 'Criando...' : 'Criar Agendamento'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🚀 Próximos Passos

1. **Implementar em componentes existentes**
2. **Adicionar testes unitários**
3. **Configurar monitoramento**
4. **Otimizar cache**
5. **Adicionar métricas de performance**

A camada de serviços está pronta para uso e fornece uma base sólida para desenvolvimento robusto! 🎉

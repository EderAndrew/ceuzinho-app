# Padrão Repository - Documentação

Este diretório implementa o padrão Repository para centralizar o acesso aos dados e melhorar a arquitetura da aplicação.

## 📁 Estrutura

```
src/repositories/
├── BaseRepository.ts      # Classe base com operações CRUD
├── UserRepository.ts      # Repositório específico para usuários
├── ScheduleRepository.ts   # Repositório específico para agendamentos
├── RepositoryFactory.ts   # Factory para criar instâncias dos repositórios
├── index.ts              # Exportações centralizadas
└── README.md             # Esta documentação
```

## 🚀 Como Usar

### 1. Importação Básica

```typescript
import { useRepositories } from '@/hooks/useRepositories';

const MyComponent = () => {
  const { user, schedule } = useRepositories();
  // ... resto do componente
};
```

### 2. Usando o UserRepository

```typescript
import { useUserRepository } from '@/hooks/useRepositories';

const MyComponent = () => {
  const userRepo = useUserRepository();
  const { token } = useUser();

  const handleLogin = async (credentials) => {
    try {
      const result = await userRepo.login(credentials);
      // result.token, result.user, result.message
    } catch (error) {
      // Tratamento de erro
    }
  };
};
```

### 3. Usando o ScheduleRepository

```typescript
import { useScheduleRepository } from '@/hooks/useRepositories';

const MyComponent = () => {
  const scheduleRepo = useScheduleRepository();
  const { token } = useUser();

  const fetchSchedules = async () => {
    try {
      const schedules = await scheduleRepo.getByDate('2024-01-15', token);
      // Usar schedules
    } catch (error) {
      // Tratamento de erro
    }
  };
};
```

## 🔧 Operações Disponíveis

### BaseRepository (Operações CRUD Básicas)

- `getAll(params?)` - Busca todos os registros
- `getById(id)` - Busca por ID
- `create(data)` - Cria novo registro
- `update(id, data)` - Atualiza registro
- `patch(id, data)` - Atualização parcial
- `delete(id)` - Remove registro
- `findWhere(filters, params?)` - Busca com filtros
- `findOne(filters)` - Busca um registro com filtros

### UserRepository (Operações Específicas de Usuário)

- `login(credentials)` - Realiza login
- `getCurrentUser(token)` - Busca usuário logado
- `changePassword(data, token)` - Altera senha
- `updateProfile(data, token)` - Atualiza perfil
- `uploadPhoto(photoUri, token)` - Upload de foto
- `getUsersByRole(role, token)` - Busca por role
- `toggleUserStatus(userId, status, token)` - Ativa/desativa usuário
- `searchUsers(filters, token)` - Busca avançada

### ScheduleRepository (Operações Específicas de Agendamentos)

- `getByDate(date, token)` - Busca por data
- `getByMonthAndUser(month, userId, token)` - Busca por mês e usuário
- `getByDateRange(startDate, endDate, token)` - Busca por período
- `getWithFilters(filters, token)` - Busca com filtros
- `createSchedule(data, token)` - Cria agendamento
- `updateSchedule(id, data, token)` - Atualiza agendamento
- `cancelSchedule(id, reason?, token)` - Cancela agendamento
- `confirmSchedule(id, token)` - Confirma agendamento
- `getStats(filters, token)` - Busca estatísticas
- `getUpcoming(limit, token)` - Próximos agendamentos
- `checkAvailability(date, time, roomId, token)` - Verifica disponibilidade
- `getByRoom(roomId, date?, token)` - Busca por sala

## 🛡️ Tratamento de Erros

O padrão Repository inclui tratamento centralizado de erros com classes específicas:

```typescript
import { ApiError, NetworkError, UnexpectedError } from '@/repositories';

try {
  const result = await userRepo.login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    // Erro da API (400, 401, 500, etc.)
    console.log('Status:', error.status);
    console.log('Mensagem:', error.message);
  } else if (error instanceof NetworkError) {
    // Erro de conexão
    console.log('Erro de rede:', error.message);
  } else if (error instanceof UnexpectedError) {
    // Erro inesperado
    console.log('Erro inesperado:', error.message);
  }
}
```

## 🎯 Benefícios

1. **Separação de Responsabilidades**: Lógica de acesso aos dados isolada
2. **Reutilização**: Código compartilhado entre componentes
3. **Testabilidade**: Fácil de mockar para testes
4. **Manutenibilidade**: Mudanças centralizadas
5. **Tipagem**: TypeScript completo com IntelliSense
6. **Tratamento de Erros**: Padronizado e consistente
7. **Performance**: Instâncias reutilizadas via Factory

## 🔄 Migração dos Serviços Antigos

Os serviços antigos (`auth.service.ts`, `schedules.service.ts`) foram refatorados para usar os repositórios, mantendo compatibilidade com o código existente.

### Antes:
```typescript
import { signIn } from '@/api/service/auth.service';
```

### Depois (Recomendado):
```typescript
import { useServices } from '@/hooks/useServices';
const { auth } = useServices();
const result = await auth.login(credentials);
```

## 📝 Exemplo Completo

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRepositories } from '@/hooks/useRepositories';
import { useUser } from '@/stores/session';
import { ApiError, NetworkError, UnexpectedError } from '@/repositories';

export const MyComponent = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const { schedule } = useRepositories();
  const { token } = useUser();

  const fetchSchedules = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await schedule.getByDate(today, token);
      setSchedules(result);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    if (error instanceof ApiError) {
      Alert.alert('Erro da API', error.message);
    } else if (error instanceof NetworkError) {
      Alert.alert('Erro de Conexão', error.message);
    } else if (error instanceof UnexpectedError) {
      Alert.alert('Erro Inesperado', error.message);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={fetchSchedules} disabled={loading}>
        <Text>{loading ? 'Carregando...' : 'Buscar Agendamentos'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🧪 Testes

Para testar componentes que usam repositórios, você pode mockar os hooks:

```typescript
// __tests__/MyComponent.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

// Mock do hook
jest.mock('@/hooks/useRepositories', () => ({
  useRepositories: () => ({
    schedule: {
      getByDate: jest.fn().mockResolvedValue([])
    }
  })
}));

test('should fetch schedules on mount', async () => {
  render(<MyComponent />);
  // ... testes
});
```

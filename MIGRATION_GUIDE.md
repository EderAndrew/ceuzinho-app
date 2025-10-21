# Guia de Migração - Arquitetura

## 📋 **Mudanças Realizadas**

### **❌ Removido:**
- `src/api/service/auth.service.ts` → Migrado para `src/services/AuthService.ts`
- `src/api/service/schedules.service.ts` → Migrado para `src/services/ScheduleService.ts`
- `src/api/service/user.service.ts` → Migrado para `src/services/UserService.ts`

### **✅ Nova Estrutura:**
```
src/
├── api/
│   └── connection.ts              # Configuração da API
├── repositories/                  # Camada de Repositórios
│   ├── BaseRepository.ts
│   ├── UserRepository.ts
│   ├── ScheduleRepository.ts
│   └── RepositoryFactory.ts
└── services/                      # Camada de Serviços
    ├── BaseService.ts
    ├── AuthService.ts
    ├── ScheduleService.ts
    ├── UserService.ts
    └── ServiceFactory.ts
```

## 🔄 **Como Migrar Imports**

### **Antes:**
```typescript
// ❌ Imports antigos
import { signIn, userSession } from '@/api/service/auth.service';
import { getSchedulesByDate, createSchedule } from '@/api/service/schedules.service';
import { uploadImage, allTeachers } from '@/api/service/user.service';
```

### **Depois:**
```typescript
// ✅ Novos imports
import { useServices } from '@/hooks/useServices';

const MyComponent = () => {
  const { auth, schedule, user } = useServices();
  
  // Usar os serviços
  const loginResult = await auth.login(credentials);
  const schedules = await schedule.getSchedulesByDate(date, token);
  const users = await user.getUsers(filters, token);
};
```

## 📝 **Mapeamento de Funções**

### **AuthService:**
| Antiga | Nova |
|--------|------|
| `signIn()` | `auth.login()` |
| `userSession()` | `auth.getCurrentUser()` |
| `changePassword()` | `auth.changePassword()` |
| `updateProfile()` | `auth.updateProfile()` |

### **ScheduleService:**
| Antiga | Nova |
|--------|------|
| `getSchedulesByDate()` | `schedule.getSchedulesByDate()` |
| `createSchedule()` | `schedule.createSchedule()` |
| `getScheduleByMonthAndUserId()` | `schedule.getSchedulesByMonth()` |
| `getScheduleById()` | `schedule.getById()` |

### **UserService:**
| Antiga | Nova |
|--------|------|
| `uploadImage()` | `user.uploadPhoto()` |
| `uploadPassword()` | `auth.changePassword()` |
| `allTeachers()` | `user.getUsersByRole()` |

## 🚀 **Benefícios da Nova Arquitetura**

1. **Separação de Responsabilidades**: Repositórios para dados, Serviços para lógica
2. **Validação Robusta**: Validações centralizadas
3. **Tratamento de Erros**: Padronizado e consistente
4. **Cache Inteligente**: Performance otimizada
5. **Testabilidade**: Fácil de mockar e testar
6. **Tipagem Completa**: TypeScript com IntelliSense

## ⚠️ **Ações Necessárias**

1. **Atualizar imports** em todos os componentes
2. **Testar funcionalidades** após migração
3. **Remover pasta vazia** `src/api/service/` manualmente
4. **Atualizar documentação** se necessário

## 🧪 **Teste de Migração**

Para testar se a migração funcionou:

```typescript
// Teste básico
import { useServices } from '@/hooks/useServices';

const TestComponent = () => {
  const { auth, schedule, user } = useServices();
  
  // Verificar se os serviços estão disponíveis
  console.log('AuthService:', !!auth);
  console.log('ScheduleService:', !!schedule);
  console.log('UserService:', !!user);
  
  return <Text>Teste de Migração</Text>;
};
```

## 📞 **Suporte**

Se encontrar problemas durante a migração:
1. Verifique se todos os imports foram atualizados
2. Confirme que os hooks estão sendo usados corretamente
3. Teste as funcionalidades uma por uma
4. Consulte a documentação em `src/services/README.md`

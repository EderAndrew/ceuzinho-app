# Gerenciamento de Estado - Documentação

Esta documentação descreve o sistema de gerenciamento de estado melhorado do projeto.

## 📁 **Estrutura dos Stores**

```
src/stores/
├── SessionStore.ts           # Gerenciamento de autenticação
├── LoadingStore.ts           # Gerenciamento de loading states
├── AppStateStore.ts          # Estado global da aplicação
├── DateStore.ts              # Gerenciamento de datas
├── PhotoStore.ts             # Gerenciamento de fotos
├── index.ts                  # Exportações centralizadas
└── README.md                 # Esta documentação
```

## 🔧 **Stores Disponíveis**

### **1. SessionStore - Autenticação**

**Funcionalidades:**
- ✅ Gerenciamento de usuário e token
- ✅ Estado de autenticação
- ✅ Validação de token
- ✅ Controle de permissões
- ✅ Persistência com AsyncStorage

**Uso:**
```typescript
import { useSessionStore, useUser } from '@/stores';

// Hook melhorado
const { user, token, isAuthenticated, login, logout, isAdmin } = useSessionStore();

// Hook de compatibilidade
const { user, token, setUser, setToken } = useUser();
```

### **2. LoadingStore - Estados de Loading**

**Funcionalidades:**
- ✅ Múltiplos loadings simultâneos
- ✅ Progresso de upload
- ✅ Mensagens personalizadas
- ✅ Loading por contexto

**Uso:**
```typescript
import { useLoadingStore, useAuthLoading } from '@/stores';

// Loading geral
const { setLoading, isLoading } = useLoadingStore();

// Loading específico
const { setLoading, isLoading } = useAuthLoading();
```

### **3. AppStateStore - Estado da Aplicação**

**Funcionalidades:**
- ✅ Monitoramento de estado da app
- ✅ Status da rede
- ✅ Duração da sessão
- ✅ Detecção de inatividade

**Uso:**
```typescript
import { useAppState } from '@/hooks/useAppState';

const { isActive, networkStatus, sessionDuration } = useAppState();
```

### **4. DateStore - Gerenciamento de Datas**

**Funcionalidades:**
- ✅ Validação de datas
- ✅ Formatação automática
- ✅ Cálculos de diferença
- ✅ Detecção de fins de semana

**Uso:**
```typescript
import { useDateManager } from '@/hooks/useAppState';

const { 
  selectedDate, 
  setSelectedDate, 
  isToday, 
  isFuture, 
  getFormattedDate 
} = useDateManager();
```

### **5. PhotoStore - Gerenciamento de Fotos**

**Funcionalidades:**
- ✅ Validação de arquivos
- ✅ Controle de tamanho
- ✅ Progresso de upload
- ✅ Preview de imagens

**Uso:**
```typescript
import { usePhotoManager } from '@/hooks/useAppState';

const { 
  selectedPhoto, 
  setSelectedPhoto, 
  isValidPhoto, 
  uploadProgress 
} = usePhotoManager();
```

## 🎯 **Hooks Personalizados**

### **useAuthState**
```typescript
const { 
  user, 
  isAuthenticated, 
  isAdmin, 
  hasPermission 
} = useAuthState();
```

### **useLoadingManager**
```typescript
const { 
  startLoading, 
  stopLoading, 
  withLoading 
} = useLoadingManager();

// Uso com operação
const result = await withLoading('auth', async () => {
  return await authService.login(credentials);
}, 'Fazendo login...');
```

### **useDateManager**
```typescript
const { 
  selectedDate, 
  isToday, 
  isFuture, 
  getFormattedDate 
} = useDateManager();
```

### **usePhotoManager**
```typescript
const { 
  selectedPhoto, 
  isValidPhoto, 
  uploadProgress 
} = usePhotoManager();
```

## 🔄 **Migração dos Stores Antigos**

### **Antes:**
```typescript
// Store antigo
const { user, token, setUser, setToken } = useUser();
const { load, setLoad } = useLoading();
```

### **Depois:**
```typescript
// Store melhorado
const { user, token, isAuthenticated, login, logout } = useSessionStore();
const { setLoading, isLoading } = useLoadingStore();
```

## 📊 **Benefícios dos Novos Stores**

### **1. SessionStore Melhorado**
- ✅ **Tipagem correta**: `IUser` em vez de `IUser[]`
- ✅ **Estado de autenticação**: Flag `isAuthenticated`
- ✅ **Validação de token**: Verifica expiração
- ✅ **Controle de permissões**: `isAdmin()`, `hasPermission()`
- ✅ **Logout centralizado**: Função `logout()`

### **2. LoadingStore Unificado**
- ✅ **Múltiplos loadings**: Diferentes operações simultâneas
- ✅ **Progresso**: Barra de progresso para uploads
- ✅ **Mensagens**: Feedback personalizado
- ✅ **Contexto**: Loading por tipo de operação

### **3. AppStateStore**
- ✅ **Monitoramento**: Estado da aplicação
- ✅ **Rede**: Status de conectividade
- ✅ **Sessão**: Duração e inatividade
- ✅ **Performance**: Otimizações automáticas

### **4. DateStore Robusto**
- ✅ **Validação**: Datas válidas
- ✅ **Formatação**: Automática por locale
- ✅ **Cálculos**: Diferenças e operações
- ✅ **Business Logic**: Fins de semana, dias úteis

### **5. PhotoStore Inteligente**
- ✅ **Validação**: Tipo e tamanho de arquivo
- ✅ **Preview**: Visualização antes do upload
- ✅ **Progresso**: Acompanhamento de upload
- ✅ **Cache**: Persistência temporária

## 🧪 **Testes**

### **Mock dos Stores**
```typescript
// __tests__/MyComponent.test.tsx
import { useSessionStore } from '@/stores';

jest.mock('@/stores', () => ({
  useSessionStore: () => ({
    user: mockUser,
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn()
  })
}));
```

## 🚀 **Exemplos de Uso**

### **Login com Loading**
```typescript
const LoginComponent = () => {
  const { login } = useSessionStore();
  const { withLoading } = useLoadingManager();
  
  const handleLogin = async (credentials) => {
    await withLoading('auth', async () => {
      const result = await authService.login(credentials);
      if (result.success) {
        login(result.data.user, result.data.token);
      }
    }, 'Fazendo login...');
  };
};
```

### **Upload de Foto com Progresso**
```typescript
const PhotoUpload = () => {
  const { setSelectedPhoto, setUploadProgress } = usePhotoManager();
  const { withLoading } = useLoadingManager();
  
  const handleUpload = async (photo) => {
    setSelectedPhoto(photo);
    
    await withLoading('photo', async () => {
      // Upload com progresso
      const result = await photoService.upload(photo, (progress) => {
        setUploadProgress(progress);
      });
    }, 'Enviando foto...');
  };
};
```

### **Validação de Data**
```typescript
const DatePicker = () => {
  const { selectedDate, setSelectedDate, isFuture, isValidDate } = useDateManager();
  
  const handleDateChange = (date) => {
    if (isValidDate(date) && isFuture(date)) {
      setSelectedDate(date);
    }
  };
};
```

## 📈 **Performance**

### **Otimizações Implementadas:**
- ✅ **Seletores**: Evita re-renders desnecessários
- ✅ **Memoização**: Cache de valores computados
- ✅ **Persistência**: AsyncStorage otimizado
- ✅ **Cleanup**: Limpeza automática de recursos

### **Monitoramento:**
```typescript
// Verificar performance dos stores
const { getLoadingCount, hasAnyLoading } = useLoadingStore();
console.log('Loadings ativos:', getLoadingCount());
```

## 🔧 **Configuração**

### **Persistência**
```typescript
// SessionStore persiste automaticamente
// Outros stores são em memória por padrão
```

### **Timezone**
```typescript
// Configurar timezone
const { setTimezone } = useDateStore();
setTimezone('America/Sao_Paulo');
```

## 📝 **Próximos Passos**

1. **Migrar componentes** para usar novos stores
2. **Adicionar testes** para todos os stores
3. **Implementar métricas** de performance
4. **Configurar monitoramento** de estado
5. **Otimizar persistência** se necessário

O sistema de gerenciamento de estado está agora robusto, tipado e pronto para escalar! 🎉

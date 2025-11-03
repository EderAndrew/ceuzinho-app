# Ceuzinho App

## 📱 Sobre o Aplicativo

**Ceuzinho App** é uma aplicação móvel desenvolvida para gerenciamento e administração de aulas em escolas infantis. O sistema permite que administradores criem e gerenciem agendamentos de aulas, professores iniciem e conduzam suas aulas, e pais acompanhem todo o processo educacional de seus filhos através de uma interface moderna e intuitiva.

### 🎯 Objetivo

Facilitar o gerenciamento completo do ciclo de vida das aulas em escolas infantis, desde o agendamento até o acompanhamento pelos pais, promovendo uma comunicação eficiente entre todos os envolvidos no processo educacional.

---

## 👥 Público-Alvo

### 🔐 Administradores
- Criar e gerenciar agendamentos de aulas
- Visualizar calendário completo de atividades
- Gerenciar professores e turmas
- Editar informações de aulas existentes

### 👨‍🏫 Professores
- Visualizar aulas atribuídas
- Iniciar aulas em tempo real
- Acompanhar o status das aulas
- Gerenciar informações das turmas

### 👨‍👩‍👧 Pais
- Acompanhar o calendário de aulas dos filhos
- Visualizar informações sobre as aulas
- Receber atualizações em tempo real

---

## ✨ Funcionalidades Principais

### 📅 Sistema de Calendário
- Visualização mensal de todas as aulas agendadas
- Seleção de datas com marcação visual
- Filtro automático de aulas mais próximas
- Integração com calendário do dispositivo

### 📝 Agendamento de Aulas
- Criação de novos agendamentos com informações completas
- Edição de aulas existentes
- Seleção de professores, turmas e períodos
- Definição de temas e horários

### 🏫 Gestão de Salas e Turmas
- Visualização de status das salas de aula
- Controle de aulas em andamento
- Início e término de aulas
- Gerenciamento de turmas (MATERNAL, etc.)

### 👨‍🏫 Gestão de Professores
- Lista completa de professores cadastrados
- Seleção múltipla de professores para cada aula
- Visualização de professores atribuídos
- Edição de atribuições

### 🔐 Sistema de Autenticação
- Login seguro com validação
- Recuperação de senha
- Gerenciamento de sessão
- Diferentes níveis de acesso (Admin, Professor, Pai)

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** - Framework para desenvolvimento de aplicações móveis multiplataforma
- **Expo** - Plataforma para desenvolvimento e deploy de aplicações React Native
- **TypeScript** - Linguagem de programação com tipagem estática
- **Expo Router** - Sistema de roteamento baseado em arquivos

### Estilização
- **NativeWind** - Implementação do Tailwind CSS para React Native
- **Tailwind CSS** - Framework CSS utilitário para design responsivo
- **React Native Reanimated** - Animações fluidas e performáticas

### Gerenciamento de Estado
- **Zustand** - Biblioteca leve para gerenciamento de estado global
- **AsyncStorage** - Armazenamento local persistente

### Componentes e Bibliotecas
- **React Native Calendars** - Componente de calendário interativo
- **Expo Camera** - Funcionalidade de câmera para fotos
- **Expo Image Picker** - Seleção de imagens da galeria
- **Axios** - Cliente HTTP para requisições à API
- **Zod** - Validação de schemas TypeScript-first

### Desenvolvimento
- **pnpm** - Gerenciador de pacotes rápido e eficiente
- **ESLint** - Linter para análise estática de código
- **TypeScript** - Tipagem estática para maior segurança

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação (Expo Router)
│   ├── (admin)/           # Rotas administrativas
│   │   ├── (tabs)/        # Navegação por abas (Calendário, Salas, Perfil)
│   │   ├── (schedules)/   # Gestão de agendamentos
│   │   └── (settings)/    # Configurações
│   └── (auth)/            # Autenticação (Login, Recuperação de senha)
├── components/            # Componentes reutilizáveis
│   ├── Calendars.tsx      # Componente de calendário
│   ├── DateCard.tsx       # Card de exibição de aula
│   ├── ClassroomOff.tsx   # Tela de sala desocupada
│   ├── TeacherList.tsx    # Lista de professores
│   └── ...
├── api/                   # Serviços de API
│   ├── connection.ts      # Configuração do Axios
│   └── service/           # Serviços por módulo
│       ├── auth.service.ts
│       ├── schedules.service.ts
│       └── user.service.ts
├── stores/                # Gerenciamento de estado (Zustand)
│   ├── session.ts         # Estado de autenticação
│   ├── scheduleStore.ts   # Estado de agendamentos
│   ├── loading.ts         # Estado de carregamento
│   └── ...
├── hooks/                 # Hooks customizados
│   ├── useDate.ts         # Formatação de datas
│   ├── compareDate.ts     # Comparação de datas
│   └── ...
├── interfaces/            # Definições TypeScript
├── schemas/               # Schemas de validação (Zod)
└── utils/                 # Funções utilitárias
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm instalado globalmente
- Expo CLI instalado globalmente
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS - apenas macOS)

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd ceuzinho-app
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie um arquivo .env na raiz do projeto
   EXPO_PUBLIC_URL=https://api.example.com
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm start
   ```

5. **Execute no dispositivo/emulador**
   ```bash
   # Android
   pnpm android
   
   # iOS
   pnpm ios
   ```

---

## 📱 Scripts Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
pnpm start

# Executar no Android
pnpm android

# Executar no iOS
pnpm ios

# Executar na Web
pnpm web

# Build para Android
pnpm android-build

# Build para iOS
pnpm ios-build
```

---

## 🎨 Design e Interface

O aplicativo utiliza um design moderno e intuitivo com:
- **Paleta de cores**: Azul água (#009cd9), Rosa (#df1b7d), Verde (#cgreen)
- **Tipografia**: Roboto (Regular, Medium, Semibold, Bold)
- **Componentes**: Cards arredondados, sombras suaves, animações fluidas
- **Navegação**: Tab bar customizada com animações de transição

---

## 🔒 Segurança

- Autenticação baseada em tokens JWT
- Armazenamento seguro de credenciais
- Validação de dados no frontend e backend
- Proteção contra race conditions e memory leaks
- Gerenciamento adequado de estado de carregamento

---

## 📊 Funcionalidades por Perfil

### 👨‍💼 Administrador
- ✅ Criar novos agendamentos
- ✅ Editar agendamentos existentes
- ✅ Visualizar calendário completo
- ✅ Gerenciar professores e turmas
- ✅ Visualizar todas as aulas

### 👨‍🏫 Professor
- ✅ Visualizar aulas atribuídas
- ✅ Iniciar aulas no horário agendado
- ✅ Visualizar informações da turma
- ✅ Acompanhar status das aulas

### 👨‍👩‍👧 Pais
- ✅ Visualizar calendário de aulas dos filhos
- ✅ Acompanhar informações das aulas
- ✅ Receber notificações sobre aulas

---

## 🐛 Troubleshooting

### Problemas Comuns

**Problema**: Aplicativo trava ao criar novo agendamento
- **Solução**: Verifique se o loading está sendo desativado corretamente e se há loops de dependências nos useEffects

**Problema**: Calendário não atualiza após criar aula
- **Solução**: Use o `useFocusEffect` para recarregar dados ao voltar para a tela

**Problema**: Erro de orientação no iOS
- **Solução**: Certifique-se de fechar o modal de loading antes de navegar

---

## 📝 Notas de Desenvolvimento

### Boas Práticas Implementadas
- Uso de `useCallback` e `useMemo` para otimização
- Proteção contra memory leaks com `isMounted`
- Validação de dados com Zod
- Separação de responsabilidades (componentes, serviços, stores)
- Tratamento de erros adequado
- Loading states gerenciados centralmente

### Melhorias Futuras
- [ ] Sistema de notificações push
- [ ] Chat em tempo real entre professores e pais
- [ ] Relatórios e estatísticas
- [ ] Modo offline
- [ ] Sincronização automática
- [ ] Integração com sistemas escolares externos

---

## 📄 Licença

Este projeto é privado e de uso exclusivo da Igreja CEU.

---

## 👥 Contribuidores

Desenvolvido para facilitar o gerenciamento de aulas na Ceuzinho da Igreja CEU.

---

## 📞 Suporte

Para questões técnicas ou suporte, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0  
**Última atualização**: 2025

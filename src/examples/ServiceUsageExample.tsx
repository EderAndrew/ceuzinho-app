import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useServices } from '@/hooks/useServices';
import { useUser } from '@/stores/session';

/**
 * Exemplo de como usar os serviços em um componente
 * Este arquivo serve como referência e pode ser removido após implementação
 */
export const ServiceUsageExample = () => {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const { auth, schedule, user, notification, validation } = useServices();
  const { token, user: currentUser } = useUser();

  // Exemplo: Login com validação
  const handleLogin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      // Validar dados antes de enviar
      const validationResult = validation.validateLogin(credentials);
      if (!validationResult.isValid) {
        const errors = validation.formatErrors(validationResult.errors);
        Alert.alert('Dados inválidos', errors.join('\n'));
        return;
      }

      // Realizar login
      const result = await auth.login(credentials);
      
      if (result.success) {
        notification.showSuccess('Login realizado com sucesso!');
        // Redirecionar ou atualizar estado
      } else {
        notification.showError(result.error || 'Erro no login');
      }
    } catch (error) {
      notification.showError('Erro inesperado no login');
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Criar agendamento com validação
  const handleCreateSchedule = async (scheduleData: any) => {
    setLoading(true);
    
    try {
      // Validar dados do agendamento
      const validationResult = validation.validateSchedule(scheduleData);
      if (!validationResult.isValid) {
        const errors = validation.formatErrors(validationResult.errors);
        Alert.alert('Dados inválidos', errors.join('\n'));
        return;
      }

      // Criar agendamento
      const result = await schedule.createSchedule(scheduleData, token!);
      
      if (result.success) {
        notification.showSuccess('Agendamento criado com sucesso!');
        
        // Agendar lembrete
        await notification.scheduleScheduleReminder(
          result.data!.id,
          scheduleData.date,
          scheduleData.time,
          scheduleData.title
        );
        
        // Atualizar lista
        fetchSchedules();
      } else {
        notification.showError(result.error || 'Erro ao criar agendamento');
      }
    } catch (error) {
      notification.showError('Erro inesperado ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Buscar agendamentos
  const fetchSchedules = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await schedule.getSchedulesByDate(today, token);
      
      if (result.success) {
        setSchedules(result.data || []);
      } else {
        notification.showError(result.error || 'Erro ao carregar agendamentos');
      }
    } catch (error) {
      notification.showError('Erro inesperado ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Atualizar perfil
  const handleUpdateProfile = async (profileData: any) => {
    if (!token) return;
    
    setLoading(true);
    try {
      // Validar dados
      const validationResult = validation.validate({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone
      }, ['name', 'email', 'phone']);
      
      if (!validationResult.isValid) {
        const errors = validation.formatErrors(validationResult.errors);
        Alert.alert('Dados inválidos', errors.join('\n'));
        return;
      }

      // Atualizar perfil
      const result = await auth.updateProfile(profileData, token);
      
      if (result.success) {
        notification.showSuccess('Perfil atualizado com sucesso!');
      } else {
        notification.showError(result.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      notification.showError('Erro inesperado ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Alterar senha
  const handleChangePassword = async (passwordData: any) => {
    if (!token) return;
    
    setLoading(true);
    try {
      // Validar dados
      const validationResult = validation.validatePasswordChange(passwordData);
      if (!validationResult.isValid) {
        const errors = validation.formatErrors(validationResult.errors);
        Alert.alert('Dados inválidos', errors.join('\n'));
        return;
      }

      // Alterar senha
      const result = await auth.changePassword(passwordData, token);
      
      if (result.success) {
        notification.showSuccess('Senha alterada com sucesso!');
      } else {
        notification.showError(result.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      notification.showError('Erro inesperado ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Buscar usuários com filtros
  const fetchUsers = async (filters: any) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const result = await user.getUsers(filters, token);
      
      if (result.success) {
        // Processar usuários
        console.log('Usuários carregados:', result.data);
      } else {
        notification.showError(result.error || 'Erro ao carregar usuários');
      }
    } catch (error) {
      notification.showError('Erro inesperado ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Verificar disponibilidade
  const checkAvailability = async (date: string, time: string, roomId: number) => {
    if (!token) return;
    
    try {
      const result = await schedule.checkAvailability(date, time, roomId, token);
      
      if (result.available) {
        notification.showSuccess('Horário disponível!');
      } else {
        notification.showWarning(result.message || 'Horário não disponível');
      }
    } catch (error) {
      notification.showError('Erro ao verificar disponibilidade');
    }
  };

  // Exemplo: Exibir notificações
  const showNotifications = () => {
    notification.showSuccess('Operação realizada com sucesso!');
    notification.showInfo('Informação importante');
    notification.showWarning('Atenção: verifique os dados');
    notification.showError('Erro na operação');
  };

  // Exemplo: Validar dados customizados
  const validateCustomData = (data: any) => {
    // Validar CPF
    const cpfResult = validation.validateCPF(data.cpf);
    if (!cpfResult.isValid) {
      notification.showError('CPF inválido');
      return;
    }

    // Validar email com domínio específico
    const emailResult = validation.validateEmailWithDomain(
      data.email, 
      ['empresa.com', 'gmail.com']
    );
    if (!emailResult.isValid) {
      notification.showError('Email deve ser de domínio válido');
      return;
    }

    notification.showSuccess('Dados válidos!');
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-4">Exemplo de Uso dos Serviços</Text>
      
      <View className="space-y-4">
        {/* Exemplo de Login */}
        <View className="bg-blue-50 p-4 rounded-lg">
          <Text className="text-lg font-semibold mb-2">Login com Validação</Text>
          <TouchableOpacity 
            className="bg-blue-500 p-3 rounded-lg"
            onPress={() => handleLogin({ email: 'test@test.com', password: '123456' })}
            disabled={loading}
          >
            <Text className="text-white text-center">
              {loading ? 'Carregando...' : 'Fazer Login'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exemplo de Agendamento */}
        <View className="bg-green-50 p-4 rounded-lg">
          <Text className="text-lg font-semibold mb-2">Criar Agendamento</Text>
          <TouchableOpacity 
            className="bg-green-500 p-3 rounded-lg"
            onPress={() => handleCreateSchedule({
              title: 'Reunião Teste',
              date: '2024-12-25',
              time: '14:00',
              roomId: 1,
              userId: 1
            })}
            disabled={loading}
          >
            <Text className="text-white text-center">Criar Agendamento</Text>
          </TouchableOpacity>
        </View>

        {/* Exemplo de Notificações */}
        <View className="bg-yellow-50 p-4 rounded-lg">
          <Text className="text-lg font-semibold mb-2">Testar Notificações</Text>
          <TouchableOpacity 
            className="bg-yellow-500 p-3 rounded-lg"
            onPress={showNotifications}
          >
            <Text className="text-white text-center">Mostrar Notificações</Text>
          </TouchableOpacity>
        </View>

        {/* Exemplo de Validação */}
        <View className="bg-purple-50 p-4 rounded-lg">
          <Text className="text-lg font-semibold mb-2">Validar Dados</Text>
          <TouchableOpacity 
            className="bg-purple-500 p-3 rounded-lg"
            onPress={() => validateCustomData({
              cpf: '12345678901',
              email: 'test@empresa.com'
            })}
          >
            <Text className="text-white text-center">Validar CPF e Email</Text>
          </TouchableOpacity>
        </View>

        {/* Status */}
        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-semibold mb-2">Status</Text>
          <Text>Agendamentos: {schedules.length}</Text>
          <Text>Notificações: {notifications.length}</Text>
          <Text>Usuário: {currentUser?.[0]?.name || 'Não logado'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

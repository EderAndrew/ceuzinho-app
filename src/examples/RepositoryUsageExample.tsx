import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRepositories } from '@/hooks/useRepositories';
import { useUser } from '@/stores/session';
import { ApiError, NetworkError, UnexpectedError } from '@/repositories/BaseRepository';

/**
 * Exemplo de como usar os repositórios em um componente
 * Este arquivo serve como referência e pode ser removido após implementação
 */
export const RepositoryUsageExample = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, schedule } = useRepositories();
  const { token } = useUser();

  // Exemplo: Buscar agendamentos
  const fetchSchedules = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await schedule.getByDate(today, token);
      setSchedules(result as any);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Exemplo: Criar agendamento
  const createSchedule = async () => {
    if (!token) return;
    
    try {
      const newSchedule = await schedule.createSchedule({
        title: 'Nova Reunião',
        description: 'Descrição da reunião',
        date: '2024-01-15',
        time: '14:00',
        roomId: 1,
        userId: 1,
        bgColor: '#3b82f6'
      }, token);
      
      Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
    } catch (error) {
      handleError(error);
    }
  };

  // Exemplo: Atualizar perfil
  const updateProfile = async () => {
    if (!token) return;
    
    try {
      const updatedUser = await user.updateProfile({
        name: 'Novo Nome',
        phone: '11999999999'
      }, token);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      handleError(error);
    }
  };

  // Tratamento centralizado de erros
  const handleError = (error: any) => {
    if (error instanceof ApiError) {
      Alert.alert('Erro da API', error.message);
    } else if (error instanceof NetworkError) {
      Alert.alert('Erro de Conexão', error.message);
    } else if (error instanceof UnexpectedError) {
      Alert.alert('Erro Inesperado', error.message);
    } else {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Exemplo de Uso dos Repositórios</Text>
      
      <TouchableOpacity 
        className="bg-blue-500 p-4 rounded-lg mb-2"
        onPress={fetchSchedules}
        disabled={loading}
      >
        <Text className="text-white text-center">
          {loading ? 'Carregando...' : 'Buscar Agendamentos'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-green-500 p-4 rounded-lg mb-2"
        onPress={createSchedule}
      >
        <Text className="text-white text-center">Criar Agendamento</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-purple-500 p-4 rounded-lg mb-2"
        onPress={updateProfile}
      >
        <Text className="text-white text-center">Atualizar Perfil</Text>
      </TouchableOpacity>
      
      <Text className="mt-4">
        Agendamentos encontrados: {schedules.length}
      </Text>
    </View>
  );
};

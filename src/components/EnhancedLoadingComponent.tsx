import React from 'react';
import { Modal, View, Text, ActivityIndicator, Animated } from 'react-native';
import { useLoadingStore } from '@/stores/LoadingStore';

interface LoadingItemProps {
  id: string;
  message?: string;
  progress?: number;
}

const LoadingItem: React.FC<LoadingItemProps> = ({ id, message, progress }) => {
  return (
    <View className="bg-white rounded-lg p-4 m-4 shadow-lg">
      <View className="flex-row items-center">
        <ActivityIndicator size="small" color="#018bba" />
        <Text className="ml-3 text-gray-800 font-medium">
          {message || 'Carregando...'}
        </Text>
      </View>
      
      {progress !== undefined && (
        <View className="mt-3">
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-acquaBlue rounded-full h-2"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-sm text-gray-600 mt-1 text-center">
            {Math.round(progress)}%
          </Text>
        </View>
      )}
    </View>
  );
};

export const EnhancedLoadingComponent: React.FC = () => {
  const { loadings, hasAnyLoading } = useLoadingStore();

  if (!hasAnyLoading()) {
    return null;
  }

  const loadingItems = Object.values(loadings);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={hasAnyLoading()}
    >
      <View className="flex-1 items-center justify-center bg-black/30">
        <View className="w-80 max-w-sm">
          {loadingItems.map((loading) => (
            <LoadingItem
              key={loading.id}
              id={loading.id}
              message={loading.message}
              progress={loading.progress}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

// Componente de loading simples (compatibilidade)
export const LoadingComponent: React.FC = () => {
  const { load } = useLoading();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={load}
    >
      <View className="flex-1 items-center justify-center bg-black/30">
        <ActivityIndicator size="large" color="#018bba" />
        <Text className="mt-2 text-xl font-RobotoRegular text-white">
          Carregando...
        </Text>
      </View>
    </Modal>
  );
};

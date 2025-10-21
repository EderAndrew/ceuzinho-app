import { useCallback, useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert, 
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { PhotoModal } from "@/components/PhotoModal";
import { CameraModal } from "@/components/CameraModal";
import { LoadingComponent } from "@/components/LoadingComponent";

import { useUser } from "@/stores/session";
import { useLoading } from "@/stores/loading";
import { useSession } from "@/hooks/useSession";

import { IUser } from "@/interfaces/IUser";

// Types
interface ProfileState {
  openModal: boolean;
  openCamera: boolean;
}

interface ProfileInfo {
  label: string;
  value: string | undefined;
  icon: string;
}

export default function Perfil() {
  // State
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openCamera, setOpenCamera] = useState<boolean>(false);

  // Stores and hooks
  const { user } = useUser();
  const { setLoad } = useLoading();
  const router = useRouter();

  // Memoized values
  const currentUser = useMemo(() => user?.[0], [user]);
  const session = useMemo(() => {
    if (!currentUser) return null;
    return useSession(currentUser as IUser).session;
  }, [currentUser]);

  const isIOS = Platform.OS === 'ios';

  // Handlers
  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Confirmar Logout",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              setLoad(true);
              await AsyncStorage.removeItem("user");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
            } finally {
              setLoad(false);
            }
          }
        }
      ]
    );
  }, [router, setLoad]);

  const handleEditProfile = useCallback(() => {
    router.push("/changePassword");
  }, [router]);

  const handleChangePhoto = useCallback(() => {
    setOpenModal(true);
  }, []);

  // Memoized profile info
  const profileInfo = useMemo((): ProfileInfo[] => [
    {
      label: "Nome",
      value: session?.name,
      icon: "person"
    },
    {
      label: "E-mail",
      value: session?.email,
      icon: "email"
    },
    {
      label: "Telefone",
      value: session?.phone,
      icon: "phone"
    }
  ], [session]);

  // Render functions
  const renderProfileInfo = useCallback((info: ProfileInfo) => (
    <View key={info.label} className="mb-4">
      <View className="flex-row items-center mb-2">
        <MaterialIcons size={20} name={info.icon as any} color="#64748b" />
        <Text className="font-RobotoSemibold text-lg text-slate-600 ml-2">
          {info.label}
        </Text>
      </View>
      <Text className="font-Roboto text-base text-slate-800 bg-slate-50 p-3 rounded-lg">
        {info.value || "Não informado"}
      </Text>
    </View>
  ), []);

  const renderPhotoSection = useCallback(() => (
    <View className="items-center mb-6">
      <View className="relative">
        <View className="w-36 h-36 bg-slate-200 rounded-full border-4 border-white shadow-lg">
          {session?.photo ? (
            <Image 
              source={{ uri: session.photo }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full rounded-full justify-center items-center bg-slate-300">
              <MaterialIcons size={48} name="person" color="#64748b" />
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={{ backgroundColor: session?.color || '#df1b7d' }}
          className="absolute -bottom-2 -right-2 p-3 rounded-full shadow-lg"
          onPress={handleChangePhoto}
          accessibilityLabel="Alterar foto do perfil"
        >
          <MaterialIcons size={24} name="camera-alt" color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={{ backgroundColor: session?.color || '#df1b7d' }}
        className="px-6 py-2 rounded-full mt-4 shadow-sm"
        disabled={!session?.roleName}
      >
        <Text className="text-white font-Roboto text-lg">
          {session?.roleName || "Usuário"}
        </Text>
      </TouchableOpacity>
    </View>
  ), [session, handleChangePhoto]);

  if (!session) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-slate-600">Carregando perfil...</Text>
        <LoadingComponent />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl font-RobotoBold text-slate-800">
              Meu Perfil
            </Text>
            <TouchableOpacity 
              className="p-2 rounded-full bg-slate-100"
              onPress={handleEditProfile}
              accessibilityLabel="Configurações do perfil"
            >
              <MaterialIcons size={24} name="settings" color="#1e293b" />
            </TouchableOpacity>
          </View>
          
          {/* Photo Section */}
          {renderPhotoSection()}
          
          {/* Profile Info */}
          <View className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
            <Text className="font-RobotoBold text-xl text-slate-800 mb-4">
              Informações Pessoais
            </Text>
            {profileInfo.map(renderProfileInfo)}
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Logout Button - Above TabBar */}
      <View className="px-4 pb-32">
        <TouchableOpacity
          className="flex-row justify-center items-center py-4 px-6 bg-red-50 border border-red-200 rounded-xl shadow-sm"
          onPress={handleLogout}
          accessibilityLabel="Sair da conta"
        >
          <MaterialIcons size={24} name="logout" color="#dc2626" />
          <Text className="text-red-600 font-RobotoSemibold text-lg ml-2">
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Modals */}
      <PhotoModal
        userId={currentUser?.id.toString() || ""}
        visible={openModal}
        setVisible={setOpenModal} 
        openCamera={setOpenCamera}
      />
      <CameraModal
        visible={openCamera}
        setVisible={setOpenCamera}
      />
      <LoadingComponent />
    </View>
  );
}
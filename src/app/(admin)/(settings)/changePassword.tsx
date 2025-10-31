import { useCallback, useState, useMemo } from "react";
import { 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Alert,
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { InputComponent } from "@/components/InputComponent";
import { ModalResetPassword } from "@/components/ModalResetPassword";
import { LoadingComponent } from "@/components/LoadingComponent";
import { HeaderComponent } from "@/components/HeaderComponent";

import { useUser } from "@/stores/session";
import { useLoading } from "@/stores/loading";

import { IPassword } from "@/interfaces/IPassword";
import { uploadPassword } from "@/api/service/user.service";
import { PasswordSchema } from "@/schemas/changePassword.schema";

// Types
interface FormErrors {
  oldPwd?: string;
  newPwd?: string;
  repeatPwd?: string;
  general?: string;
}

interface ChangePasswordState {
  formPwd: IPassword;
  errors: FormErrors;
  visibleReset: boolean;
  isLoading: boolean;
}

export default function ChangePassword() {
  // State
  const [formPwd, setFormPwd] = useState<IPassword>({
    oldPwd: "",
    newPwd: "",
    repeatPwd: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [visibleReset, setVisibleReset] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Stores and hooks
  const { token, user } = useUser();
  const { setLoad } = useLoading();
  const router = useRouter();

  // Memoized values
  const currentUser = useMemo(() => user?.[0], [user]);
  const isFormValid = useMemo(() => {
    return formPwd.oldPwd.length >= 6 && 
           formPwd.newPwd.length >= 6 && 
           formPwd.repeatPwd.length >= 6 &&
           formPwd.newPwd === formPwd.repeatPwd;
  }, [formPwd]);

  // Validation functions
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    // Clear previous errors
    setErrors({});

    // Validate old password
    if (!formPwd.oldPwd) {
      newErrors.oldPwd = "Senha atual é obrigatória";
    } else if (formPwd.oldPwd.length < 6) {
      newErrors.oldPwd = "Senha deve ter pelo menos 6 caracteres";
    }

    // Validate new password
    if (!formPwd.newPwd) {
      newErrors.newPwd = "Nova senha é obrigatória";
    } else if (formPwd.newPwd.length < 6) {
      newErrors.newPwd = "Nova senha deve ter pelo menos 6 caracteres";
    }

    // Validate repeat password
    if (!formPwd.repeatPwd) {
      newErrors.repeatPwd = "Confirmação de senha é obrigatória";
    } else if (formPwd.newPwd !== formPwd.repeatPwd) {
      newErrors.repeatPwd = "Senhas não coincidem";
    }

    // Check if old and new passwords are the same
    if (formPwd.oldPwd === formPwd.newPwd) {
      newErrors.newPwd = "A nova senha deve ser diferente da senha atual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formPwd]);

  // Handlers
  const handleChangePassword = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (!currentUser?.email || !token) {
      Alert.alert("Erro", "Dados do usuário não encontrados.");
      return;
    }

    try {
      setIsLoading(true);
      setLoad(true);
      
      const payload: PasswordSchema = {
        email: currentUser.email,
        oldPwd: formPwd.oldPwd,
        newPwd: formPwd.newPwd,
        repeatPwd: formPwd.repeatPwd
      };
      
      const resp = await uploadPassword(payload, token);

      if (resp?.status !== 200) {
        throw new Error(resp?.message || "Erro ao alterar senha");
      }
      
      setVisibleReset(true);
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      const message = error?.response?.data?.message || error?.message || "Erro inesperado ao alterar senha.";
      
      setErrors({ general: message });
      Alert.alert("Erro", message);
    } finally {
      setIsLoading(false);
      setLoad(false);
    }
  }, [validateForm, currentUser, token, formPwd, setLoad]);

  const handleLogout = useCallback(async () => {
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
  }, [router, setLoad]);

  const handleInputChange = useCallback((field: keyof IPassword, value: string) => {
    setFormPwd(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Render functions
  const renderInputField = useCallback((
    label: string,
    field: keyof IPassword,
    placeholder: string
  ) => (
    <View className="mb-6">
      <Text className="font-RobotoSemibold text-lg text-slate-700 mb-2">
        {label}
      </Text>
      <InputComponent
        hasIcon={false}
        placeholder={placeholder}
        value={formPwd[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        secureTextEntry={true}
      />
      {errors[field] && (
        <Text className="text-red-500 text-sm mt-1 font-Roboto">
          {errors[field]}
        </Text>
      )}
    </View>
  ), [formPwd, errors, handleInputChange]);

  if (!currentUser) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-slate-600">Carregando dados do usuário...</Text>
        <LoadingComponent />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
      <HeaderComponent title="Alterar Senha" />
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Form Section */}
          <View className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-6">
            <Text className="font-RobotoBold text-xl text-slate-800 mb-6">
              Alterar Senha de Acesso
            </Text>
            
            {/* General Error */}
            {errors.general && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <Text className="text-red-600 font-RobotoSemibold text-center">
                  {errors.general}
                </Text>
              </View>
            )}
            
            {/* Input Fields */}
            {renderInputField(
              "Senha Atual",
              "oldPwd",
              "Digite sua senha atual"
            )}
            
            {renderInputField(
              "Nova Senha",
              "newPwd",
              "Digite a nova senha"
            )}
            
            {renderInputField(
              "Confirmar Nova Senha",
              "repeatPwd",
              "Digite novamente a nova senha"
            )}
            
            {/* Password Requirements */}
            <View className="bg-slate-50 rounded-lg p-4 mt-4">
              <Text className="font-RobotoSemibold text-slate-700 mb-2">
                Requisitos da senha:
              </Text>
              <Text className="text-slate-600 text-sm">
                • Mínimo de 6 caracteres
              </Text>
              <Text className="text-slate-600 text-sm">
                • Deve ser diferente da senha atual
              </Text>
              <Text className="text-slate-600 text-sm">
                • Confirmação deve ser idêntica
              </Text>
            </View>
          </View>
        </ScrollView>
        
        {/* Action Button */}
        <View className="px-4 pb-4">
          <TouchableOpacity
            className={`
              flex-row justify-center items-center py-4 px-6 rounded-xl shadow-sm
              ${isFormValid && !isLoading 
                ? 'bg-bcgreen' 
                : 'bg-slate-300'
              }
            `}
            onPress={handleChangePassword}
            disabled={!isFormValid || isLoading}
            accessibilityLabel="Alterar senha"
          >
            <MaterialIcons 
              size={24} 
              name="lock" 
              color={isFormValid && !isLoading ? "#fff" : "#9ca3af"} 
            />
            <Text className={`
              font-RobotoSemibold text-lg ml-2
              ${isFormValid && !isLoading ? 'text-white' : 'text-slate-400'}
            `}>
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Modals */}
      <ModalResetPassword
        visible={visibleReset}
        handleLogout={handleLogout}
      />
      <LoadingComponent />
    </View>
  );
}
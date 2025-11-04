import { useCallback, useState, useMemo, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Platform, 
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SystemBars } from "react-native-edge-to-edge";

import { InputComponent } from "@/components/InputComponent";
import { ButtonComponent } from "@/components/ButtonComponent";
import { LoadingComponent } from "@/components/LoadingComponent";

import { useUser } from "@/stores/session";
import { useLoading } from "@/stores/loading";

import { LoginSchema } from "@/schemas/login.schema";
import { passwordRecovery, signIn, userSession } from "@/api/service/auth.service";
import { ILogin } from "@/interfaces/ILogin";

import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { OtpComponent } from "@/components/OtpComponent";


// Constants
const SCREEN_HEIGHT = Dimensions.get('window').height;
const LOGO_HEIGHT = 112; // h-28 = 112px

export default function ForgetPassword() {
  // State
  const [form, setForm] = useState<LoginSchema>({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [etapa, setEtapa] = useState<number>(0);

  // Stores and hooks
  const { setUser, setToken } = useUser();
  const { setLoad, load } = useLoading();
  const router = useRouter();

  // Constants
  const logoImage = useMemo(() => require("@/assets/images/logo.png"), []);

  const isEmailValid = useMemo(() => {
    return form.email.length > 0;
  }, [form.email]);
    
  // Validation functions
  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};
    
    // Clear previous errors
    setErrors({});
    setMessage("");

    // Validate email
    if (!form.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Handlers
  const handleInputChange = useCallback((field: keyof LoginSchema, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear general message when user types
    if (message) {
      setMessage("");
    }
  }, [errors, message]);

  const handlePasswordRecovery = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setLoad(true);
      setMessage("");
      setErrors({});
      
      await passwordRecovery(form.email);
      
      if (!isLoading && !load && etapa === 0){
        setEtapa(1);
        console.log("Mostrar OTC no componente");
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error?.message || "Erro inesperado ao Verificar o E-mail.";
      setMessage(errorMessage);
      setErrors({ general: errorMessage });
      
      Alert.alert(
        "Erro ao recuperar senha",
        errorMessage,
        [{ text: "Tentar Novamente" }]
      );
    } finally {
      setIsLoading(false);
      setLoad(false);
    }
  }, [validateForm, form, setUser, setToken, router, setLoad, etapa]);

  // Render functions
  const renderErrorMessage = useCallback(() => {
    if (message) {
      return (
        <View className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <Text className="text-red-600 font-RobotoSemibold text-center">
            {message}
          </Text>
        </View>
      );
    }
    return null;
  }, [message]);

  const renderFieldError = useCallback((field: keyof LoginSchema) => {
    const error = errors[field];
    if (error) {
      return (
        <Text className="text-red-500 text-sm mt-1 font-Roboto">
          {error}
        </Text>
      );
    }
    return null;
  }, [errors]);

  return (
  <View className="flex-1 justify-center bg-white">
      <SystemBars style="dark" hidden={true} />
        {/* Logo Section */}
        <SafeAreaView className="bg-white justify-center items-center"
          style={{ height: SCREEN_HEIGHT * 0.35, minHeight: LOGO_HEIGHT + 100 }}
        >
          <Image 
            source={logoImage}
            className='w-full h-28'
            resizeMode="contain"
          />
        </SafeAreaView>
        
        {/* Login Form Section */}
        <SafeAreaView className="flex-1 justify-between bg-acquaBlue rounded-t-2xl">
          <View className="px-6 pt-8 pb-4">
            {/* Header */}
            <View className="mb-8">
              <Text className="font-RobotoBold text-3xl text-white mb-2">
                Esqueci minha senha
              </Text>
              <Text className="font-Roboto text-white/80 text-lg">
                {etapa === 0 ? "Digite o seu email para receber um link de recuperação" : "Digite o código enviado para seu email"}
              </Text>
            </View>
            
            {/* Form Fields */}
            {etapa === 0 && 
              <View className="gap-6">
                {/* Email Field */}
                <View>
                  <InputComponent
                    icon="email"
                    placeholder="Digite seu e-mail"
                    value={form.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                  />
                  {renderFieldError('email')}
                </View>
                
                {/* Error Message */}
                {renderErrorMessage()}
              </View>
            }
            {etapa === 1 && <OtpComponent />}
            
          </View>
          
          {/* Action Button */}
          <View className="px-6 pb-8 gap-4">
            <ButtonComponent
              title={isLoading ? "Enviando..." : "Enviar"}
              bgColor={isEmailValid && !isLoading ? "bg-darkPink" : "bg-slate-400"}
              handleLogin={handlePasswordRecovery}
            />
            <Text className="text-white text-center font-RobotoRegular text-sm">ou</Text>
            <TouchableOpacity
                className="flex-row items-center justify-center gap-2"
                onPress={() => router.back()}
            >
                <MaterialIcons name="arrow-back" size={24} color="white" />
                <Text className="text-white text-center font-RobotoRegular text-sm">Voltar para login</Text>
            </TouchableOpacity>
            {/* Version Info */}
            <View className="items-center mt-6">
              <Text className="text-white/60 text-sm">
                V1.0 Calendar App
              </Text>
              <Text className="text-white/40 text-xs mt-1">
                Sistema de Agendamentos
              </Text>
            </View>
          </View>
        </SafeAreaView>
      <LoadingComponent />
    </View>
  );
}
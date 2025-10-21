import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { InputComponent } from "@/components/InputComponent";
import { LoginSchema } from "@/schemas/login.schema";
import { useServices } from "@/hooks/useServices";
import { ILogin } from "@/interfaces/ILogin"
import { useRouter } from "expo-router";
import { useUser } from "@/stores/session";
import { ButtonComponent } from "@/components/ButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { SystemBars } from "react-native-edge-to-edge";

export default function Login(){
    const router = useRouter()
    const { setUser, setToken } = useUser()
    const {setLoad} = useLoading()
    const { auth } = useServices()
    
    const [message, setMessage] = useState("")
    const [form, setForm] = useState<LoginSchema>({
        email: "",
        password: ""
    })
    
    const logoImage = require("@/assets/images/logo.png")
    
    const handleLogin = async() => {
        setLoad(true)
        setMessage("")
        
        try {
            const result = await auth.login(form)

            if(!result.success){
                setLoad(false)
                setMessage(result.error || "Erro no login")
                return
            }

            setToken(result.data!.token)
            setUser([result.data!.user])

            router.replace('/(admin)/calendar')
        } catch (error) {
            setMessage("Erro inesperado.")
        } finally {
            setLoad(false)
        }
    }
    const ErrorMessage = message.length > 0 ? <Text className="font-RobotoSemibold text-xl text-red-700 text-center mt-5">{message}</Text> : ""
    return(
        <View className="flex-1 justify-center bg-white">
            <SystemBars style="dark" hidden={true} />
            <SafeAreaView className="h-[27rem] bg-white justify-center items-center">
                <Image 
                    source={logoImage}
                    className='w-full h-28'
                    resizeMode="contain"
                />  
            </SafeAreaView>
            <SafeAreaView className="flex-1 justify-between bg-acquaBlue items-center rounded-t-2xl">
                <View className="px-10 gap-4">
                    <View className="w-[100%] mt-8">
                        <Text className="font-RobotoBold font-semibold text-3xl text-white">Login</Text>
                    </View>
                    <InputComponent
                        icon="person"
                        placeholder="E-mail"
                        value={form.email}
                        onChangeText={(text) => setForm({...form, email: text})}
                        keyboardType="email-address"
                    />
                    <InputComponent 
                        icon="lock"
                        placeholder="Senha"
                        value={form.password}
                        onChangeText={(text) => setForm({...form, password: text})}
                        keyboardType="default"
                        secureTextEntry={true}
                    />
                    <View className="w-96 items-end">
                        <TouchableOpacity onPress={() => router.navigate('/forgetPassword')}>
                            <Text className="font-RobotoLight text-white">Esqueci minha senha</Text>
                        </TouchableOpacity>
                    </View>
                    { ErrorMessage }
                </View>
                <ButtonComponent
                    title={"Acessar"}
                    bgColor={"bg-darkPink"}
                    handleLogin={handleLogin}
                />
                <Text className="text-white text-sm mb-5">V1.0 Calendar</Text>
            </SafeAreaView>
            <LoadingComponent />
        </View>
    )
}
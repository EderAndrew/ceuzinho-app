import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { InputComponent } from "@/components/InputComponent";
import { LoginSchema } from "@/schemas/login.schema";
import { signIn, userSession } from "@/api/service/auth.service";
import { ILogin } from "@/interfaces/ILogin"
import { useRouter } from "expo-router";
import { useUser } from "@/stores/session";
import { ButtonComponent } from "@/components/ButtonComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";

export default function Login(){
    const router = useRouter()
    const { setUser, setToken } = useUser()
    const {setLoad} = useLoading()
    
    const [message, setMessage] = useState("")
    const [form, setForm] = useState<LoginSchema>({
        email: "",
        password: ""
    })
    
    const logoImage = require("@/assets/images/logo.png")
    
    const handleLogin = async() => {
        setLoad(true)
        setMessage("")
        const data: ILogin = await signIn(form)

        if(data.error){
            setLoad(false)
            setMessage(data.message)
            return
        }

        const resp = await userSession(data.token!)

        if(!resp){
            setLoad(false)
            return setMessage("Erro inesperado.")
        }
        
        setToken(data.token as string)
        setUser([resp.user])

        router.replace('/(admin)/calendar')
        setLoad(false)

    }
    const ErrorMessage = message.length > 0 ? <Text className="font-RobotoSemibold text-xl text-red-700 text-center mt-5">{message}</Text> : ""
    return(
        <SafeAreaView className="flex-1 justify-center">
            <View className="h-[27rem] bg-white justify-center items-center">
                <Image 
                    source={logoImage}
                    className="w-full h-28"
                    resizeMode="contain"
                />  
            </View>
            <View className="flex-1 justify-between bg-acquaBlue items-center rounded-t-2xl">
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
            </View>
            <LoadingComponent />
        </SafeAreaView>
    )
}
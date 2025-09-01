import { useState } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { InputComponent } from "@/components/InputComponent";
import { LoginSchema } from "@/schemas/login.schema";
import { signIn } from "@/api/service/auth.service";

export default function Login(){
    const [form, setForm] = useState<LoginSchema>({
        email: "",
        password: ""
    })
    
    const logoImage = require("@/assets/images/logo.png")
    
    const handleLogin = async() => {
        const data = await signIn(form)

        console.log(data)
    }

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
                <View>
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
                    <View className="w-96 mt-3 items-end">
                        <TouchableOpacity>
                            <Text className="font-RobotoLight text-white">Esqueci minha senha</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    className="w-96 h-14 flex justify-center items-center rounded-lg bg-darkPink"
                    onPress={handleLogin}
                >
                    <Text className="font-RobotoRegular text-white font-normal text-xl">Acessar</Text>
                </TouchableOpacity>
                <Text className="text-white text-sm mb-5">V1.0 Calendar</Text>
            </View>
        </SafeAreaView>
    )
}
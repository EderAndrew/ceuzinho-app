import { useState } from "react";
import { View, Text, SafeAreaView, TextInput, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { InputComponent } from "@/components/InputComponent";

export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const logoImage = require("@/assets/images/logo.png")
    
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
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <InputComponent 
                        icon="lock"
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        keyboardType="default"
                        secureTextEntry={true}
                    />
                    <View className="w-96 mt-3 items-end">
                        <TouchableOpacity>
                            <Text className="font-RobotoLight text-white">Esqueci minha senha</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity className="w-96 h-14 flex justify-center items-center rounded-lg bg-darkPink">
                    <Text className="font-RobotoRegular text-white font-normal text-xl">Acessar</Text>
                </TouchableOpacity>
                <Text className="text-white text-sm mb-5">V1.0 Calendar</Text>
            </View>
        </SafeAreaView>
    )
}
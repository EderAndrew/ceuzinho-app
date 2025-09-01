import { useState } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return(
        <SafeAreaView className="flex-1 justify-center">
            <View className="h-[27rem] bg-white justify-center items-center">
                <Text>Ceuzinho</Text>
            </View>
            <View className="flex-1 bg-acquaBlue items-center rounded-t-2xl">
                <View>
                    <View className="w-[100%] mt-8">
                        <Text className="font-semibold text-3xl text-white">Login</Text>
                    </View>
                    <View className="w-96 h-14 mt-6 border border-slate-400 bg-white rounded-md flex-row items-center">
                        <MaterialIcons size={28} name="person" color={"#9c9c9c"} />
                        <TextInput
                            className="text-xl w-[100%]"                          
                            onChangeText={setEmail}
                            value={email}
                            placeholder="E-mail"
                            keyboardType="email-address"
                        />
                    </View>
                    <View className="w-96 h-14 mt-6 border border-slate-400 bg-white rounded-md flex-row items-center">
                        <MaterialIcons size={28} name="lock" color={"#9c9c9c"} />
                        <TextInput
                            className="text-xl w-[100%]"                          
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Senha"
                            secureTextEntry={true}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
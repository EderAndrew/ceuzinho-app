import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";
import { InputComponent } from "@/components/InputComponent";
import { useState } from "react";
import { IPassword } from "@/interfaces/IPassword";

export default function ChangePassword(){
    const route = useRouter()
    const [errorMessage, setErrorMessage] = useState("")
    const [formPwd, setFormPwd] = useState<IPassword>({
        oldPwd: "",
        newPwd: "",
        repeatPwd: ""
    })

    const handleChangePassword = () => {
        const payload = {
            oldPwd: formPwd.oldPwd,
            newPwd: formPwd.newPwd,
            repeatPwd: formPwd.repeatPwd
        }

        console.log(payload)
        //route.back()
    }

    return(
        <SafeAreaView className="flex-1 px-4 mt-8 bg-white">
            <View className="flex-1 justify-between items-center">
                <View>
                    <View className="flex flex-row items-center gap-2">
                        <TouchableOpacity onPress={()=> route.back()}>
                            <MaterialIcons size={38} name='arrow-back' color={"#1e293b"} />
                        </TouchableOpacity>
                        <Text className="text-4xl font-RobotoBold text-slate-800">Mudar a Senha</Text>
                    </View>
                    <View className="mt-6 gap-2">
                        <Text className="font-Roboto text-xl">Digite a sua senha</Text>
                        <InputComponent
                            hasIcon={false}
                            placeholder={"Senha Antiga"}
                            value={formPwd.oldPwd}
                            onChangeText={(text) => setFormPwd({...formPwd, oldPwd: text})}
                            secureTextEntry={true}
                        />
                    </View>
                    <View className="mt-6 gap-2">
                        <Text className="font-Roboto text-xl">Digite a nova Senha</Text>
                        <InputComponent
                            hasIcon={false}
                            placeholder={"Senha nova"}
                            value={formPwd.newPwd}
                            onChangeText={(text) => setFormPwd({...formPwd, newPwd: text})}
                            secureTextEntry={true}
                        />
                    </View>
                    <View className="mt-6 gap-2">
                        <Text className="font-Roboto text-xl">Repita a Senha</Text>
                        <InputComponent
                            hasIcon={false}
                            placeholder={"Repetir nova Senha"}
                            value={formPwd.repeatPwd}
                            onChangeText={(text) => setFormPwd({...formPwd, repeatPwd: text})}
                            secureTextEntry={true}
                        />
                    </View>
                    <Text className="m-auto mt-8 font-RobotoBold text-xl text-red-600">{errorMessage}</Text>
                </View>
                <TouchableOpacity className="m-auto" onPress={handleChangePassword}>
                    <Text className="bg-bcgreen text-xl font-RobotoSemibold">Trocar</Text>
                </TouchableOpacity>                
            </View>
            
        </SafeAreaView>
    )
}
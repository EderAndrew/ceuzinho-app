import { Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";
import { InputComponent } from "@/components/InputComponent";
import React, { useState } from "react";
import { IPassword } from "@/interfaces/IPassword";
import { useUser } from "@/stores/session";
import { uploadPassword } from "@/api/service/user.service";
import { ModalResetPassword } from "@/components/ModalResetPassword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword(){
    const route = useRouter()
    const [errorMessage, setErrorMessage] = useState("")
    const [visibleReset, setVisibleReset] = useState(false)
    const { token, user } = useUser()
    const { setLoad } = useLoading()
    const [formPwd, setFormPwd] = useState<IPassword>({
        oldPwd: "",
        newPwd: "",
        repeatPwd: ""
    })

    const handleChangePassword = async() => {
        try{
            setLoad(true)
            const payload = {
                email: user?.[0].email,
                oldPwd: formPwd.oldPwd,
                newPwd: formPwd.newPwd,
                repeatPwd: formPwd.repeatPwd
            }
            if(formPwd.oldPwd === ""  || formPwd.newPwd === "" || formPwd.repeatPwd === ""){
                setLoad(false)
                setErrorMessage("Preencha todos os campos.")
                return
            }
            
            const resp = await uploadPassword(payload, token!)

            if(resp?.status !== 200) return
            
            setVisibleReset(true)
        }catch(error: any){
            const message = error?.response?.data?.message || "Erro inesperado.";
            setErrorMessage(message);
        }finally{
            setLoad(false)
        }
        
    }

    const handleLogout = async() => {
        setLoad(true)
        await AsyncStorage.removeItem("user")
        route.replace("/(auth)/login")
        setLoad(false)
    }

    return(
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 p-4 mt-8 justify-between items-center">
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
                <TouchableOpacity onPress={handleChangePassword} className="m-auto">
                    <Text className="bg-bcgreen text-xl font-RobotoSemibold">Trocar</Text>
                </TouchableOpacity>                
            </View>
            <ModalResetPassword
                visible={visibleReset}
                handleLogout={handleLogout}
            />
            <LoadingComponent />
        </SafeAreaView>
    )
}
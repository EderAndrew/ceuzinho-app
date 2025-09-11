import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useUser } from "@/stores/session";
import { useSession } from "@/hooks/useSession";
import { IUser } from "@/interfaces/IUser";

export default function Settings(){
    const { user } = useUser()
    const { color, photoUrl, roleName } = useSession(user?.[0] as IUser)

    return(
        <SafeAreaView className="flex-1 bg-white">
            <Text className="text-4xl font-RobotoBold mt-8 ml-4 text-slate-800">Meu Perfil</Text>
            <View className="w-full flex justify-center items-center mt-10">
                <View className="w-40 h-40 bg-slate-400 rounded-full border">
                    {photoUrl && (
                        <Image 
                            source={{ uri: photoUrl }}
                            className="w-full h-full rounded-full"
                            resizeMode="cover"
                        />
                    )}
                </View>
                <TouchableOpacity
                    style={{ backgroundColor: color }}
                    className={`p-2 rounded-full absolute ml-24 mt-32`}
                >
                    <MaterialIcons size={30} name='camera-alt' color={"#FFF"} />
                </TouchableOpacity>
                
            </View>
            <TouchableOpacity
                style={{ backgroundColor: color }}
                className=" w-44 p-2 rounded-full self-center mt-5 flex justify-center items-center"
            >
                <Text className="text-white font-Roboto text-xl">{roleName}</Text>
            </TouchableOpacity>
            {/* Removido: textos de debug */}
            <Text>{photoUrl}</Text>
        </SafeAreaView>
    )
}
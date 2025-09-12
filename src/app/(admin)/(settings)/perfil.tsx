import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useUser } from "@/stores/session";
import { useSession } from "@/hooks/useSession";
import { IUser } from "@/interfaces/IUser";
import { useState } from "react";
import { PhotoModal } from "@/components/PhotoModal";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil(){
    const { user } = useUser()
    const { session } = useSession(user?.[0] as IUser)
    const [openModal, setOpenModal] = useState(false)
    const route = useRouter()

    return(
        <SafeAreaView className="flex-1 bg-white px-4">
            <View className="flex-1 justify-between">
                <View>
                    <View className="flex flex-row w-full justify-between items-center">
                        <Text className="text-4xl font-RobotoBold mt-8 ml-4 text-slate-800">Meu Perfil</Text>
                        <TouchableOpacity className="mt-8 mr-4" onPress={()=>route.push("/changePassword")}>
                            <MaterialIcons size={30} name='settings' color={"#1e293b"} />
                        </TouchableOpacity>
                    </View>
                    
                    <View className="w-full flex justify-center items-center mt-10">
                        <View className="w-40 h-40 bg-slate-400 rounded-full border">
                            {session!.photo && (
                                <Image 
                                    source={{ uri: session?.photo }}
                                    className="w-full h-full rounded-full"
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: session?.color }}
                            className={`p-2 rounded-full absolute ml-24 mt-32`}
                            onPress={()=>setOpenModal(true)}
                        >
                            <MaterialIcons size={30} name='camera-alt' color={"#FFF"} />
                        </TouchableOpacity>
                        
                    </View>
                    <TouchableOpacity
                        style={{ backgroundColor: session?.color }}
                        className=" w-44 p-2 rounded-full self-center mt-5 flex justify-center items-center"
                    >
                        <Text className="text-white font-Roboto text-xl">{session!.roleName}</Text>
                    </TouchableOpacity>
                    <View className="mx-5 mt-10 gap-2">
                        <Text className="font-RobotoSemibold text-2xl">Nome</Text>
                        <Text className="font-Roboto text-xl">{session?.name}</Text>
                        <Text className="font-RobotoSemibold text-2xl">E-mail</Text>
                        <Text>{session?.email}</Text>
                        <Text className="font-RobotoSemibold text-2xl">Fone</Text>
                        <Text>{session?.phone}</Text>
                    </View>
                </View>            
                <TouchableOpacity
                    className="flex items-center justify-centerw-60 p-2 rounded-full"
                >
                    <Text className="text-darkPink font-RobotoSemibold text-xl">Sair</Text>
                </TouchableOpacity>
            </View>
            <PhotoModal
                userId={user?.[0]?.id.toString() as string}
                visible={openModal}
                setVisible={setOpenModal}
            />
            <LoadingComponent />
        </SafeAreaView>
    )
}
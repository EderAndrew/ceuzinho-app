import { ClassroomOff } from "@/components/ClassroomOff";
import { HeaderComponent } from "@/components/HeaderComponent";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StudentCard } from "@/components/StudentCard";

export default function NewRoom(){
    const [isClassroomOff, setIsClassroomOff] = useState<boolean>(false);
    //Pegar aulas do mês
    
    //Quando estiver na data da aula, o botão iniciar deve ser habilitado
    //Ao iniciar a aula, o componente muda para o compo nente de aula em andamento e no banco de dados o status da aula deve ser alternado para em andamento...

    return(
        <View className="flex-1 bg-white px-4">
            {isClassroomOff && <ClassroomOff />}
            <SafeAreaView className="flex-1 gap-2">
                <View className="flex-row justify-between items-center">
                    <HeaderComponent title="Aula" btnBack={false}/>
                    <Text className="text-sm">Time: 00:00</Text>
                </View>
                <View className="items-left gap-2 border border-slate-400 rounded-lg p-2 bg-slate-100 mt-4">
                    <View className="flex-row justify-between items-center">
                        <Text>Professores(as):</Text>
                        <Text>Domingo, 02 Nov</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className="h-12 w-12 rounded-full bg-slate-300 border border-slate-400"></View>
                        <Text>Nome do Professor 1</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className="h-10 w-10 rounded-full bg-slate-300 border border-slate-400 ml-[.25rem]"></View>
                        <Text className="ml-1">Nome do Professor 2</Text>
                    </View>
                </View>
                <View className="items-center gap-2">
                    <Text className="text-xl font-semibold">Tema da Aula:</Text>
                    <Text className="text-lg">Aula Livre</Text>
                </View>
                <View className="h-96 items-left gap-2 border border-slate-400 rounded-lg p-2 bg-slate-100 mt-4">
                    <View className="flex-row justify-between items-center border-b border-slate-400 pb-2">
                        <Text className="text-xl font-semibold">Alunos</Text>
                        <TouchableOpacity className="flex-row items-center gap-2 bg-cgreen rounded-md p-2 shadow-sm">
                            <MaterialIcons size={18} name={"add"} color={"#fff"} />
                            <Text className="text-sm text-white">Adicionar Aluno</Text>
                        </TouchableOpacity>
                    </View>
                    <StudentCard />
                </View>
            </SafeAreaView>
        </View>
    )
}
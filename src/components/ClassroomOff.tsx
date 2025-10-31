import { HeaderComponent } from "@/components/HeaderComponent";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDate } from "@/hooks/useDate";
import { useEffect, useMemo, useState } from "react";
import { useschedule } from "@/stores/scheduleStore";
import { CompareDate } from "@/hooks/compareDate";

export const ClassroomOff = () => {
    const [date, setDate] = useState<string>("");
    const currentDate = useMemo(() => new Date(), []);
    const [enableButton, setEnableButton] = useState<boolean>(true);
    const { schedule } = useschedule();
    
    //Pegar aula mais próxima
    useEffect(() => {
        if(schedule.length > 0){
            const teste = CompareDate(currentDate, schedule[0].date.split("T")[0]);
            console.log("Teste: ", teste);
        }
    }, [schedule]);

    useEffect(() => {
        const formattedDate = useDate(currentDate);
        setDate(formattedDate);
    }, []);

    return (
        <SafeAreaView className="flex-1">
            <HeaderComponent title="Sala de Aula" btnBack={false}/>
            <Text className="text-xl font-RobotoBold text-slate-800">{date}</Text>
            <View className="flex-1 justify-around">
                <View className="justify-center items-center gap-3">
                    <Text className="text-xl font-RobotoBold text-slate-700">Não existe Aula no momento</Text>
                    <MaterialIcons size={46} name="school" color="#999" />
                </View>
                <View className="justify-center items-center gap-6">
                    <Text>Próxima aula</Text>
                    <Text className="text-xl font-RobotoBold text-slate-700">Domingo, 02 Nov</Text>
                    <TouchableOpacity className="h-28 w-28 bg-cgreen py-2 px-4 rounded-full justify-center items-center">
                        <Text className="text-white text-xl font-RobotoBold">Iniciar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
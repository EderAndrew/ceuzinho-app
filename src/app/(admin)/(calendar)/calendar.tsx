import { Calendars } from "@/components/Calendars";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { DateCard } from "@/components/DateCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ISchedules } from "@/interfaces/ISchedules";
import { useUser } from "@/stores/session";
import { getSchedulesByDate } from "@/api/service/schedules.service";
import { useRouter } from "expo-router";

export default function Calendar(){
    const [schedules, setSchedules] = useState<ISchedules[]>([])
    const [dateData, setDateData] = useState(new Date().toISOString().split("T")[0])
    const [dateNow, setDateNow] = useState(new Date().toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                year: 'numeric', 
                month: 'short', 
                day: '2-digit'
            }).split(", ")[0]);
    const { token } = useUser()
    const router = useRouter()
        
    useEffect(()=>{
        (async()=>{
            const data = await getSchedulesByDate(dateData, token as string)
            if(!data) return

            setSchedules(data.data)
        })()
    },[dateData])

    return(
        <SafeAreaView className="flex-1 bg-white">
            <Calendars
                setData={setDateData}
                dateNow={dateNow}
                setDateNow={setDateNow}
            />
            <View className="p-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl">{dateNow}</Text>
                    <TouchableOpacity
                        className="bg-cgreen rounded-full p-1"
                        onPress={()=>router.navigate("newCalendar")}
                    >
                        <MaterialIcons size={28} name={"add"} color={"#FFF"} />
                    </TouchableOpacity>
                </View>
                <FlatList 
                    data={schedules}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <DateCard data={item} />}
                    ListEmptyComponent={
                        <View className="justify-center items-center mt-10">
                            <Text className="font-semibold text-lg text-slate-400">Nenhum agendamento encontrado</Text>
                        </View>
                    }
                />                
            </View>
        </SafeAreaView>
    )
}
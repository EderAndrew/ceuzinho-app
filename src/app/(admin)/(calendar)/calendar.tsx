import { Calendars } from "@/components/Calendars";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { DateCard } from "@/components/DateCard";
import { ISchedules } from "@/interfaces/ISchedules";
import { useUser } from "@/stores/session";
import { getSchedulesByDate } from "@/api/service/schedules.service";
import { useRouter } from "expo-router";
import { useDate } from "@/hooks/useDate";
import { useDateStore } from "@/stores/DateStore";
import { CompareDate } from "@/hooks/compareDate";

export default function Calendar(){
    const [schedules, setSchedules] = useState<ISchedules[]>([])
    const [dateData, setDateData] = useState(new Date().toISOString().split("T")[0])
    const [dateNow, setDateNow] = useState(new Date());
    const [dataHasTrue, setDataHasTrue] = useState<boolean>(false)
    const { token } = useUser()
    const { date, setDate } = useDateStore()
    const router = useRouter()
        
    useEffect(()=>{
        (async()=>{
            const data = await getSchedulesByDate(dateData, token as string)
            if(!data) return

            setSchedules(data.data)
        })()
    },[dateData])

    useEffect(()=>{
        (()=>{
            const d = useDate(dateNow)
            setDate(d)
        })()
    },[])

    useEffect(()=>{
        (()=>{
            const compare = CompareDate(dateNow, dateData)
            setDataHasTrue(compare)
        })()
    },[dateData])

    return(
        <SafeAreaView className="flex-1 bg-white">
            <Calendars
                setData={setDateData}
            />
            <View className="p-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl">{date}</Text>
                    <TouchableOpacity
                        className={`${dataHasTrue ? "bg-cgreen" : "bg-slate-400"} rounded-full p-1`}
                        onPress={()=>{
                            if(!dataHasTrue) return
                            router.navigate("newCalendar")
                        }}
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
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Calendars } from "@/components/Calendars";
import { DateCard } from "@/components/DateCard";
import { ISchedules } from "@/interfaces/ISchedules";

import { useUser } from "@/stores/session";
import { useDateStore } from "@/stores/DateStore";
import { useFocusEffect, useRouter } from "expo-router";

import { getScheduleByMonthAndUserId, getSchedulesByDate } from "@/api/service/schedules.service";
import { useDate } from "@/hooks/useDate";
import { CompareDate } from "@/hooks/compareDate";
import { LocalDate } from "@/utils/localDate";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { monthConvert } from "@/utils/monthConvert";
import { SystemBars } from "react-native-edge-to-edge";

export default function Calendar(){
    const [schedules, setSchedules] = useState<ISchedules[]>([]);
    const [selectedDate, setSelectedDate] = useState(LocalDate());
    const [isFutureDate, setIsFutureDate] = useState(false);
    const [markedMonth, setMarkedMonth] = useState<Record<string, any>>({})

    const currentDate = new Date();
    const { user, token } = useUser();
    const { date, setDate } = useDateStore();
    const {setLoad} = useLoading()
    const router = useRouter();

    const isIOS = Platform.OS === 'ios'

        
    // Atualiza data formatada no store
    useEffect(() => {
        const formattedDate = useDate(currentDate);
        setDate(formattedDate);
    }, []);

    // Verifica se a data selecionada é futura
    useEffect(() => {
        const result = CompareDate(currentDate, selectedDate);
        setIsFutureDate(result);
    }, [selectedDate]);

    // Busca agendamentos da data selecionada
    useFocusEffect(
        useCallback(() => {
            
            const fetchSchedules = async () => {
                try {
                    const response = await getSchedulesByDate(selectedDate, token as string);
                    if (!response?.data) {
                    setSchedules([]);
                    return;
                    }

                    setSchedules(response.data);
                } catch (error) {
                    Alert.alert("Erro", "Não foi possível carregar os agendamentos.");
                }
            };

            fetchSchedules();
        }, [selectedDate])
    );


    const handleAddSchedule = () => {
        if (!isFutureDate) return;
        router.navigate("(schedules)/newSchedule");
    };
    
    const handlerSchedulesMonth = async(month: string) => {
        try{
            setLoad(true)
            const resp = await getScheduleByMonthAndUserId(month, user?.[0].id as number, token as string)

            if (!resp.data || resp.data.length === 0) return;

            let info: { [key: string]: any } = {};
            resp.data.forEach((item: ISchedules) => {
                const dateKey = item.date.split("T")[0];
                info[dateKey] = { selected: true, selectedColor: item.bgColor };

            })
            let today: { [key: string]: any } = {};
            today[selectedDate] = { selected: true, selectedColor: '#df1b7d'}
            setMarkedMonth({...today, ...info})
        }catch(error){
            console.log(error)
        }finally{
            setLoad(false)
        }
        
    }

    useEffect(()=>{
        const monthC = monthConvert(Number(selectedDate.split("-")[1]))
        handlerSchedulesMonth(monthC as string)
    },[])

    return(
        <View className="flex-1 bg-white">
            {isIOS ? null:<SystemBars style="dark" hidden={true} />}
            <SafeAreaView className={Platform.select({
                ios:"bg-acquaBlue rounded-s-2xl rounded-e-2xl",
                android:"bg-acquaBlue rounded-s-2xl rounded-e-2xl h-[30rem]"
            })}>
                <View className="flex px-4 flex-row justify-between">
                    <Text className="text-3xl font-semibold text-white">Calendário</Text>
                    <TouchableOpacity>
                        <MaterialIcons size={24} name={"book"} color={"#df1b7d"} />
                    </TouchableOpacity>
                </View>            
                <Calendars
                    setData={setSelectedDate}
                    handlerSchedulesMonth={handlerSchedulesMonth}
                    markedMonth={markedMonth}
                />
            </SafeAreaView>
            <View className="px-4 mt-4 bg-white">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl">{date}</Text>
                    {user?.[0].role === "ADMIN" && (
                        <TouchableOpacity
                            className={`${isFutureDate ? "bg-cgreen" : "bg-slate-400"} rounded-full p-1`}
                            onPress={handleAddSchedule}
                        >
                            <MaterialIcons size={28} name={"add"} color={"#FFF"} />
                        </TouchableOpacity>
                    )}
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
            <LoadingComponent />
        </View>
    )
}
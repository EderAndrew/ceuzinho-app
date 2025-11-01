import { useCallback, useEffect, useMemo, useState } from "react";
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

    const currentDate = useMemo(() => new Date(), []);
    const { user, token } = useUser();
    const { date, setDate } = useDateStore();
    const {setLoad} = useLoading()
    const router = useRouter();

    const isIOS = Platform.OS === 'ios'

    const selectedDaySummary = useMemo(() => {
        if (!schedules.length) {
            return {
                headline: "Nenhum agendamento",
                detail: "Escolha uma data diferente ou crie um novo compromisso."
            };
        }

        const firstSchedule = schedules[0];
        return {
            headline: firstSchedule.tema || "Agendamento confirmado",
            detail: `${firstSchedule.timeStart} • ${firstSchedule.timeEnd}`
        };
    }, [schedules]);

    const summaryCountLabel = useMemo(() => {
        if (!schedules.length) return "Sem horários para esta data";
        if (schedules.length === 1) return "1 horário confirmado";
        return `${schedules.length} horários confirmados`;
    }, [schedules]);

        
    // Atualiza data formatada no store
    useEffect(() => {
        const formattedDate = useDate(currentDate);
        setDate(formattedDate);
    }, [currentDate, setDate]);

    // Verifica se a data selecionada é futura
    useEffect(() => {
        const result = CompareDate(currentDate, selectedDate);
        setIsFutureDate(result);
    }, [currentDate, selectedDate]);

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
        router.navigate("newCalendar");
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
        <View className="flex-1 bg-slate-50">
            {!isIOS && <SystemBars style="dark" hidden={true} />}
            <SafeAreaView className="flex-1">
                <View className="bg-acquaBlue px-5 pt-6 pb-10 rounded-b-[32px]">
                    <View className="flex-row items-start justify-between">
                        <View className="gap-2 flex-1 pr-4">
                            <Text className="text-xs uppercase tracking-[2px] text-white/70">Planejamento</Text>
                            <Text className="text-[32px] leading-8 font-semibold text-white">Calendário</Text>
                            <Text className="text-sm text-white/80">
                                Visualize agendas e mantenha o controle das próximas aulas.
                            </Text>
                        </View>
                        <TouchableOpacity className="bg-white/15 rounded-full p-2">
                            <MaterialIcons size={26} name={"book"} color={"#ffffff"} />
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white/12 rounded-2xl p-4 mt-6 border border-white/15">
                        <Text className="text-xs uppercase tracking-wide text-white/70">Data selecionada</Text>
                        <Text className="text-xl font-semibold text-white mt-1">{date}</Text>
                        <Text className="text-sm text-white/70 mt-2">{summaryCountLabel}</Text>

                        <View className="mt-4 bg-white/10 rounded-xl p-3 border border-white/10">
                            <Text className="text-xs text-white/70 uppercase">Resumo</Text>
                            <Text className="text-base font-semibold text-white mt-1">
                                {selectedDaySummary.headline}
                            </Text>
                            <Text className="text-sm text-white/75 mt-0.5">
                                {selectedDaySummary.detail}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-1 -mt-12 px-5 pb-6">
                    <View className="bg-white rounded-3xl shadow-md shadow-black/10 overflow-hidden">
                        <Calendars
                            setData={setSelectedDate}
                            handlerSchedulesMonth={handlerSchedulesMonth}
                            markedMonth={markedMonth}
                        />
                    </View>

                    <View className="flex-row items-center justify-between mt-8 mb-3">
                        <Text className="text-lg font-semibold text-slate-800">Agendamentos</Text>
                        {user?.[0].role === "ADMIN" && (
                            <TouchableOpacity
                                className={`${isFutureDate ? "bg-cgreen" : "bg-slate-300"} rounded-full px-4 py-2 flex-row items-center gap-2`}
                                onPress={handleAddSchedule}
                                disabled={!isFutureDate}
                            >
                                <MaterialIcons size={20} name={"add"} color={"#FFF"} />
                                <Text className="text-white text-sm font-medium">
                                    Novo horário
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={schedules}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <DateCard data={item} />}
                        contentContainerStyle={{
                            paddingBottom: 32
                        }}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-12">
                                <MaterialIcons name="event-busy" size={48} color="#CBD5F5" />
                                <Text className="font-semibold text-lg text-slate-500 mt-4">
                                    Nenhum agendamento para esta data
                                </Text>
                                <Text className="text-sm text-slate-400 mt-1 text-center px-4">
                                    Selecione outra data no calendário ou crie um novo horário.
                                </Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <LoadingComponent />
            </SafeAreaView>
        </View>
    )
}
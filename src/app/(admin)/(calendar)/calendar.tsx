import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Calendars } from "@/components/Calendars";
import { DateCard } from "@/components/DateCard";
import { ISchedules } from "@/interfaces/ISchedules";

import { useUser } from "@/stores/session";
import { useDateStore } from "@/stores/DateStore";
import { useRouter } from "expo-router";

import { getSchedulesByDate } from "@/api/service/schedules.service";
import { useDate } from "@/hooks/useDate";
import { CompareDate } from "@/hooks/compareDate";


export default function Calendar(){
    const [schedules, setSchedules] = useState<ISchedules[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [isFutureDate, setIsFutureDate] = useState(false);

    const currentDate = new Date();
    const { token } = useUser();
    const { date, setDate } = useDateStore();
    const router = useRouter();

        
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
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await getSchedulesByDate(selectedDate, token as string);
                if (!response?.data) {
                    setSchedules([]);
                    return 
                }

                setSchedules(response.data);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os agendamentos.");
            }
        }

        fetchSchedules();
    }, [selectedDate]);

    const handleAddSchedule = () => {
        if (!isFutureDate) return;
        router.navigate("newCalendar");
    };
    
    return(
        <SafeAreaView className="flex-1 bg-white">
            <Calendars
                setData={setSelectedDate}
            />
            <View className="p-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl">{date}</Text>
                    <TouchableOpacity
                        className={`${isFutureDate ? "bg-cgreen" : "bg-slate-400"} rounded-full p-1`}
                        onPress={handleAddSchedule}
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
            <StatusBar style="dark" backgroundColor="#009cd9" />
        </SafeAreaView>
    )
}
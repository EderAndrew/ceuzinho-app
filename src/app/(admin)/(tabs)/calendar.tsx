import { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  RefreshControl
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { SystemBars } from "react-native-edge-to-edge";

import { Calendars } from "@/components/Calendars";
import { DateCard } from "@/components/DateCard";
import { LoadingComponent } from "@/components/LoadingComponent";
import { ISchedules } from "@/interfaces/ISchedules";

import { useUser } from "@/stores/session";
import { useDateStore } from "@/stores/DateStore";
import { useLoading } from "@/stores/loading";

import { getScheduleByMonthAndUserId, getSchedulesByDate } from "@/api/service/schedules.service";
import { useDate } from "@/hooks/useDate";
import { CompareDate } from "@/hooks/compareDate";
import { LocalDate } from "@/utils/localDate";
import { monthConvert } from "@/utils/monthConvert";

// Types
interface MarkedDates {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

interface CalendarState {
  schedules: ISchedules[];
  selectedDate: string;
  isFutureDate: boolean;
  markedMonth: MarkedDates;
  isRefreshing: boolean;
}

export default function Calendar() {
  // State
  const [schedules, setSchedules] = useState<ISchedules[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(LocalDate());
  const [isFutureDate, setIsFutureDate] = useState<boolean>(false);
  const [markedMonth, setMarkedMonth] = useState<MarkedDates>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Stores and hooks
  const { user, token } = useUser();
  const { date, setDate } = useDateStore();
  const { setLoad } = useLoading();
  const router = useRouter();

  // Constants
  const currentDate = useMemo(() => new Date(), []);
  const isIOS = Platform.OS === 'ios';
  const isAdmin = user?.[0]?.role === "ADMIN";

  // Effects
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
  const fetchSchedules = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await getSchedulesByDate(selectedDate, token);
      if (!response?.data) {
        setSchedules([]);
        return;
      }
      setSchedules(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      Alert.alert(
        "Erro", 
        "Não foi possível carregar os agendamentos. Tente novamente."
      );
    }
  }, [selectedDate, token]);

  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [fetchSchedules])
  );


  // Handlers
  const handleAddSchedule = useCallback(() => {
    if (!isFutureDate || !isAdmin) return;
    router.navigate("(schedules)/newSchedule");
  }, [isFutureDate, isAdmin, router]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchSchedules();
    setIsRefreshing(false);
  }, [fetchSchedules]);
    
  const handlerSchedulesMonth = useCallback(async (month: string) => {
    if (!user?.[0]?.id || !token) return;
    
    try {
      setLoad(true);
      const resp = await getScheduleByMonthAndUserId(
        month, 
        user[0].id, 
        token
      );

      if (!resp.data || resp.data.length === 0) {
        setMarkedMonth({ [selectedDate]: { selected: true, selectedColor: '#df1b7d' } });
        return;
      }

      const markedDates: MarkedDates = {};
      resp.data.forEach((item: ISchedules) => {
        const dateKey = item.date.split("T")[0];
        markedDates[dateKey] = { 
          selected: true, 
          selectedColor: item.bgColor 
        };
      });
      
      // Marca a data selecionada
      markedDates[selectedDate] = { 
        selected: true, 
        selectedColor: '#df1b7d' 
      };
      
      setMarkedMonth(markedDates);
    } catch (error) {
      console.error('Erro ao carregar agendamentos do mês:', error);
    } finally {
      setLoad(false);
    }
  }, [user, token, selectedDate, setLoad]);

  // Carrega agendamentos do mês atual
  useEffect(() => {
    const monthNumber = Number(selectedDate.split("-")[1]);
    const monthName = monthConvert(monthNumber);
    if (monthName) {
      handlerSchedulesMonth(monthName);
    }
  }, [handlerSchedulesMonth, selectedDate]);

  // Memoized components
  const renderScheduleItem = useCallback(({ item }: { item: ISchedules }) => (
    <DateCard data={item} />
  ), []);

  const renderEmptyComponent = useCallback(() => (
    <View className="justify-center items-center mt-10">
      <MaterialIcons size={48} name="event-busy" color="#9CA3AF" />
      <Text className="font-semibold text-lg text-slate-400 mt-2">
        Nenhum agendamento encontrado
      </Text>
      <Text className="text-sm text-slate-400 mt-1">
        {isFutureDate ? 'Adicione um novo agendamento' : 'Não há agendamentos para esta data'}
      </Text>
    </View>
  ), [isFutureDate]);

  return (
    <View className="flex-1 bg-white">
      {!isIOS && <SystemBars style="dark" hidden={true} />}
      
      <SafeAreaView className={Platform.select({
        ios: "bg-acquaBlue rounded-s-2xl rounded-e-2xl",
        android: "bg-acquaBlue rounded-s-2xl rounded-e-2xl h-[30rem]"
      })}>
        <View className="flex px-4 flex-row justify-between items-center">
          <Text className="text-3xl font-semibold text-white">Calendário</Text>
          <TouchableOpacity 
            className="p-2 rounded-full bg-white/20"
            accessibilityLabel="Ver agenda"
          >
            <MaterialIcons size={24} name="book" color="#df1b7d" />
          </TouchableOpacity>
        </View>
        
        <Calendars
          setData={setSelectedDate}
          handlerSchedulesMonth={handlerSchedulesMonth}
          markedMonth={markedMonth}
        />
      </SafeAreaView>
      
      <View className="px-4 mt-4 bg-white flex-1">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-medium">{date}</Text>
          {isAdmin && (
            <TouchableOpacity
              className={`${
                isFutureDate ? "bg-cgreen" : "bg-slate-400"
              } rounded-full p-2 shadow-sm`}
              onPress={handleAddSchedule}
              disabled={!isFutureDate}
              accessibilityLabel={isFutureDate ? "Adicionar agendamento" : "Não é possível adicionar agendamento para datas passadas"}
            >
              <MaterialIcons size={28} name="add" color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={schedules}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderScheduleItem}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#df1b7d']}
              tintColor="#df1b7d"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      
      <LoadingComponent />
    </View>
  );
}
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
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
import { useschedule } from "@/stores/scheduleStore";

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
  const { schedule, setSchedule } = useschedule();

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

  // Função para encontrar a schedule mais próxima da data de hoje
  const findNearestSchedule = useCallback((schedules: ISchedules[]): ISchedules | null => {
    if (!schedules || schedules.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera horas para comparar apenas datas
    
    // Filtra apenas schedules futuras ou de hoje
    const futureSchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      scheduleDate.setHours(0, 0, 0, 0);
      return scheduleDate >= today;
    });
    
    if (futureSchedules.length === 0) return null;
    
    // Encontra a schedule mais próxima (menor data futura)
    // Se houver múltiplas na mesma data, pega a com menor horário de início
    const nearestSchedule = futureSchedules.reduce((nearest, current) => {
      const nearestDate = new Date(nearest.date);
      const currentDate = new Date(current.date);
      
      // Compara datas (ignora horário)
      nearestDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      // Se a data atual é menor (mais próxima de hoje), retorna current
      if (currentDate.getTime() < nearestDate.getTime()) {
        return current;
      }
      
      // Se a data atual é maior (mais distante), mantém nearest
      if (currentDate.getTime() > nearestDate.getTime()) {
        return nearest;
      }
      
      // Se são a mesma data, compara o horário de início
      const currentTime = current.timeStart.split(':').map(Number);
      const nearestTime = nearest.timeStart.split(':').map(Number);
      const currentMinutes = currentTime[0] * 60 + (currentTime[1] || 0);
      const nearestMinutes = nearestTime[0] * 60 + (nearestTime[1] || 0);
      
      // Retorna a que tem o menor horário de início
      if (currentMinutes < nearestMinutes) {
        return current;
      }
      
      return nearest;
    });
    
    return nearestSchedule;
  }, []);

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
  
  // Usa useRef para manter selectedDate atual sem causar re-criação da função
  const selectedDateRef = useRef(selectedDate);
  
  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);
    
  const handlerSchedulesMonth = useCallback(async (month: string, currentSelectedDate?: string) => {
    if (!user?.[0]?.id || !token) return;
    
    // Usa o parâmetro ou o valor do ref (sempre atualizado)
    const dateToUse = currentSelectedDate || selectedDateRef.current;
    
    try {
      setLoad(true);
      const resp = await getScheduleByMonthAndUserId(
        month, 
        user[0].id, 
        token
      );

      if (!resp.data || resp.data.length === 0) {
        setMarkedMonth({ [dateToUse]: { selected: true, selectedColor: '#df1b7d' } });
        setSchedule([]); // Limpa o store se não houver schedules
        setLoad(false);
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
      markedDates[dateToUse] = { 
        selected: true, 
        selectedColor: '#df1b7d' 
      };
      
      setMarkedMonth(markedDates);
      
      // Encontra e salva a schedule mais próxima da data de hoje
      const nearestSchedule = findNearestSchedule(resp.data);
      if (nearestSchedule) {
        setSchedule([nearestSchedule]);
      } else {
        setSchedule([]); // Limpa o store se não houver schedule futura
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos do mês:', error);
    } finally {
      setLoad(false);
    }
  }, [user, token, setLoad, findNearestSchedule, setSchedule]);

  // Calcula o mês e ano de forma estável usando useMemo
  // Isso evita re-renderizações desnecessárias quando apenas o dia muda
  const currentMonthYear = useMemo(() => {
    const dateParts = selectedDate.split("-");
    const year = dateParts[0];
    const monthNumber = Number(dateParts[1]);
    const monthName = monthConvert(monthNumber);
    return monthName ? `${year}-${monthName}` : null;
  }, [selectedDate]);

  // Carrega agendamentos do mês atual - depende apenas do mês/ano, não do dia
  // Isso evita chamadas desnecessárias à API quando apenas o dia muda dentro do mesmo mês
  useEffect(() => {
    if (!currentMonthYear || !user?.[0]?.id || !token) return;
    
    const monthName = currentMonthYear.split("-")[1];
    handlerSchedulesMonth(monthName, selectedDate);
  }, [currentMonthYear, user?.[0]?.id, token]); // Intencionalmente não inclui selectedDate e handlerSchedulesMonth

  // Atualiza apenas a marcação da data selecionada quando o dia muda dentro do mesmo mês
  // Isso evita bloqueios desnecessários da UI
  useEffect(() => {
    setMarkedMonth(prev => ({
      ...prev,
      [selectedDate]: { 
        selected: true, 
        selectedColor: '#df1b7d' 
      }
    }));
  }, [selectedDate]);

  // Atualiza quando volta para a tela (após criar novo agendamento)
  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
      // Atualiza os marcadores do mês quando volta para a tela
      // Isso garante que novos agendamentos sejam mostrados no calendário
      const monthNumber = Number(selectedDate.split("-")[1]);
      const monthName = monthConvert(monthNumber);
      if (monthName && user?.[0]?.id && token) {
        handlerSchedulesMonth(monthName, selectedDate);
      }
    }, [fetchSchedules, selectedDate, user, token, handlerSchedulesMonth])
  );

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
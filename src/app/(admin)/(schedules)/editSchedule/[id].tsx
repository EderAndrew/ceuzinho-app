import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderComponent } from "@/components/HeaderComponent";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/stores/session";
import { getScheduleById } from "@/api/service/schedules.service";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { ISchedules } from "@/interfaces/ISchedules";
import { InputComponent } from "@/components/InputComponent";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { PickerInput } from "@/components/PickerInput";
import { Periods, Room } from "@/utils/room";
import { TeacherList } from "@/components/TeacherList";

export default function EditSchedule() {
    const [schedule, setSchedule] = useState<ISchedules>();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { setLoad } = useLoading();
    const { token } = useUser();

    useEffect(() => {
        let isMounted = true;

        const loadSchedule = async () => {
            if (!id || !token) {
                return;
            }

            setLoad(true);
            try {
                const data = await getScheduleById(Number(id), token);
                if (!data?.data || !isMounted) return;
                setSchedule(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoad(false);
                }
            }
        };

        loadSchedule();

        return () => {
            isMounted = false;
            setLoad(false);
        };
    }, [id, token, setLoad]);

    const formattedDate = useMemo(() => {
        if (!schedule?.date) return "";
        try {
            return new Date(schedule.date).toLocaleDateString();
        } catch {
            return schedule.date;
        }
    }, [schedule?.date]);
 
    return (
        <View className="flex-1 bg-slate-50">
            <SafeAreaView className="flex-1">
                <HeaderComponent title="Editar Calendário" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 48 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View className="px-4 mt-4">
                    <View className="bg-white rounded-3xl border border-white shadow-sm shadow-slate-200 p-5 mb-6">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1 pr-4">
                                <Text className="text-xs uppercase tracking-wide text-slate-400">Data agendada</Text>
                                <Text className="text-2xl font-semibold text-slate-800 mt-1">
                                    {formattedDate || "--/--/----"}
                                </Text>
                                <Text className="text-sm text-slate-500 mt-2">
                                    Revise as informações antes de atualizar o agendamento.
                                </Text>
                            </View>
                            <View className="w-12 h-12 rounded-full bg-acquaBlue/10 items-center justify-center">
                                <MaterialIcons name="event" size={26} color="#009cd9" />
                            </View>
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200 p-5 gap-4 mb-6">
                        <Text className="text-base font-semibold text-slate-700">Informações gerais</Text>

                        <View className="gap-2">
                            <Text className="text-xs uppercase tracking-wide text-slate-400">Tema</Text>
                            <InputComponent
                                hasIcon={false}
                                value={schedule?.tema ?? ""}
                                onChangeText={(text) => console.log(text)}
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-xs uppercase tracking-wide text-slate-400">Turma</Text>
                            <PickerInput
                                selectInfoType={schedule?.room ?? ""}
                                setSelectInfoType={(value) => console.log(value)}
                                infoObject={Room}
                                labelKey="label"
                                valueKey="value"
                            />
                        </View>

                        <View className="gap-2">
                            <Text className="text-xs uppercase tracking-wide text-slate-400">Período</Text>
                            <PickerInput
                                selectInfoType={schedule?.period ?? ""}
                                setSelectInfoType={(value) => console.log(value)}
                                infoObject={Periods}
                                labelKey="label"
                                valueKey="value"
                            />
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200 p-5 mb-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-base font-semibold text-slate-700">Professores</Text>
                            <View className="px-3 py-1 rounded-full bg-acquaBlue/10">
                                <Text className="text-xs font-medium text-acquaBlue">
                                    {schedule?.room ?? "Turma"}
                                </Text>
                            </View>
                        </View>
                        <TeacherList />
                    </View>

                    <TouchableOpacity
                        className="bg-darkPink rounded-full py-4 px-8 shadow-lg shadow-pink-200"
                        activeOpacity={0.9}
                    >
                        <Text className="text-white text-base font-semibold text-center">
                            Salvar alterações
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </SafeAreaView>
            <LoadingComponent />
        </View>
    );
}
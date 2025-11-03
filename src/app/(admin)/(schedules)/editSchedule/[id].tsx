import { useLocalSearchParams } from "expo-router";
import { FlatList, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderComponent } from "@/components/HeaderComponent";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { IUser } from "@/interfaces/IUser";
import { allTeachers } from "@/api/service/user.service";
import Checkbox from "expo-checkbox";

export default function EditSchedule() {
    const [schedule, setSchedule] = useState<ISchedules>();
    const [teachers, setTeachers] = useState<IUser[]>([]);
    const { id } = useLocalSearchParams<{ id: string }>();
    const { setLoad } = useLoading();
    const { user, token } = useUser();

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!id || !token) {
                return;
            }

            setLoad(true);
            try {
                // Carrega schedule e professores em paralelo
                const [scheduleData, teachersData] = await Promise.all([
                    getScheduleById(Number(id), token),
                    allTeachers(token)
                ]);

                if (!isMounted) return;

                if (scheduleData?.data) {
                    setSchedule(scheduleData.data);
                }
                
                if (teachersData?.teachers) {
                    setTeachers(teachersData.teachers);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                if (isMounted) {
                    setLoad(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
            setLoad(false);
        };
    }, [id, token, setLoad]);

    const formattedDate = useMemo(() => {
        if (!schedule?.date) return "";
        try {
            return new Date(schedule.date).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
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
                        <FlatList
                            data={teachers}
                            renderItem={({item}) => (
                                <View key={item.id} className="flex-row items-center gap-2 mb-2">
                                    <Checkbox
                                        style={{ width: 24, height: 24 }}
                                        value={item.id === schedule?.teacherOneUser?.id || item.id === schedule?.teacherTwoUser?.id}
                                        onValueChange={() => console.log(item.id)}
                                        accessibilityLabel={`Selecionar professor ${item.name}`}
                                        accessibilityRole="checkbox"
                                    />
                                    {item.id && user && (item.id === user[0].id) ?
                                        <TouchableOpacity 
                                            className="flex-row w-[22rem] items-center gap-2 bg-slate-100 p-2 rounded-xl"
                                            onPress={() => console.log(item.id)}
                                        >
                                            {item.photoUrl ? 
                                                <Image source={{ uri: item.photoUrl }} className="w-10 h-10 rounded-full" /> :
                                                <View className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                                                    <Text className="text-white font-semibold text-sm">{item.name.charAt(0).toUpperCase()}</Text>
                                                </View>
                                            }
                                            <View className="flex flex-row justify-between items-center w-72">
                                                <Text className="text-lx font-semibold">{item.name}</Text>
                                                <View className="mr-5">
                                                    <MaterialIcons name="change-circle" size={24} color="#df1b7d" />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <View className="flex-row items-center gap-2">
                                            {item.photoUrl ? 
                                                <Image source={{ uri: item.photoUrl }} className="w-10 h-10 rounded-full" /> :
                                                <View className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center">
                                                    <Text className="text-white font-semibold text-sm">{item.name.charAt(0).toUpperCase()}</Text>
                                                </View>
                                            }
                                            <Text>{item.name}</Text>
                                        </View>
                                    }
                                </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => (
                                <View className="flex items-center justify-center py-8">
                                    <Text className="text-gray-500">Nenhum professor encontrado</Text>
                                </View>
                            )}
                        />
                        
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
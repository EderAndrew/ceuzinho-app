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
    const { schedule } = useschedule();
    
    const nextSchedule = useMemo(() => schedule?.[0] ?? null, [schedule]);
    const isFutureLesson = useMemo(() => {
        if (!nextSchedule) return false;
        return CompareDate(currentDate, nextSchedule.date.split("T")[0]);
    }, [currentDate, nextSchedule]);
    const isTodayLesson = useMemo(() => {
        if (!nextSchedule) return false;
        const todayKey = new Date().toISOString().split("T")[0];
        const lessonKey = nextSchedule.date.split("T")[0];
        return todayKey === lessonKey;
    }, [nextSchedule]);
    const formattedLessonDate = useMemo(() => {
        if (!nextSchedule) return undefined;
        return useDate(new Date(nextSchedule.date));
    }, [nextSchedule]);
    const formattedLessonTime = useMemo(() => {
        if (!nextSchedule) return undefined;
        return `${nextSchedule.timeStart} • ${nextSchedule.timeEnd}`;
    }, [nextSchedule]);
    const lessonTeachers = useMemo(() => {
        if (!nextSchedule) return [] as string[];
        return [nextSchedule.teacherOneUser?.name, nextSchedule.teacherTwoUser?.name]
            .filter(Boolean) as string[];
    }, [nextSchedule]);

    useEffect(() => {
        const formattedDate = useDate(currentDate);
        setDate(formattedDate);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <HeaderComponent title="Sala de Aula" btnBack={false} />

            <View className="flex-1 px-4 pb-6">
                <View className="bg-acquaBlue/10 border border-acquaBlue/30 rounded-2xl p-4 mb-6">
                    <Text className="text-xs uppercase tracking-wide text-acquaBlue">Hoje</Text>
                    <Text className="text-2xl font-RobotoBold text-slate-900 mt-1">{date}</Text>
                    <Text className="text-sm text-slate-500 mt-2">
                        Acompanhe as aulas agendadas e inicie assim que estiver na hora.
                    </Text>
                </View>

                <View className="flex-1 justify-center">
                    {!nextSchedule ? (
                        <View className="items-center gap-3">
                            <MaterialIcons size={64} name="school" color="#CBD5F5" />
                            <Text className="text-xl font-RobotoBold text-slate-700 text-center">
                                Nenhuma aula agendada
                            </Text>
                            <Text className="text-sm text-slate-500 text-center">
                                Assim que um novo encontro for criado, ele aparecerá aqui para você acompanhar.
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <View className="flex-row justify-between items-center mb-4">
                                <View>
                                    <Text className="text-xs uppercase tracking-wide text-slate-400">Próxima aula</Text>
                                    <Text className="text-xl font-RobotoBold text-slate-800 mt-1">
                                        {formattedLessonDate}
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name="event-available"
                                    size={32}
                                    color="#009cd9"
                                />
                            </View>

                            <View className="gap-3">
                                {nextSchedule.tema && (
                                    <View className="flex-row items-start gap-3">
                                        <MaterialIcons name="menu-book" size={22} color="#64748b" />
                                        <View className="flex-1">
                                            <Text className="text-xs uppercase tracking-wide text-slate-400">Tema</Text>
                                            <Text className="text-base font-RobotoSemibold text-slate-700">
                                                {nextSchedule.tema}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {formattedLessonTime && (
                                    <View className="flex-row items-start gap-3">
                                        <MaterialIcons name="schedule" size={22} color="#64748b" />
                                        <View>
                                            <Text className="text-xs uppercase tracking-wide text-slate-400">Horário</Text>
                                            <Text className="text-base font-RobotoSemibold text-slate-700">
                                                {formattedLessonTime}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                <View className="flex-row items-start gap-3">
                                    <MaterialIcons name="group" size={22} color="#64748b" />
                                    <View className="flex-1">
                                        <Text className="text-xs uppercase tracking-wide text-slate-400">Turma</Text>
                                        <Text className="text-base font-RobotoSemibold text-slate-700">
                                            {nextSchedule.room}
                                        </Text>
                                        {lessonTeachers.length > 0 && (
                                            <Text className="text-sm text-slate-500 mt-1">
                                                {lessonTeachers.join(" • ")}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View className="mt-6">
                                <TouchableOpacity
                                    className={`w-full py-4 rounded-full items-center justify-center ${
                                        isTodayLesson ? "bg-cgreen" : "bg-slate-300"
                                    }`}
                                    activeOpacity={0.9}
                                    disabled={!isTodayLesson}
                                >
                                    <Text className="text-white text-lg font-RobotoBold">
                                        {isTodayLesson ? "Iniciar aula" : isFutureLesson ? "Aula agendada" : "Aula encerrada"}
                                    </Text>
                                </TouchableOpacity>
                                {!isTodayLesson && (
                                    <Text className="text-xs text-slate-400 text-center mt-2">
                                        O botão fica disponível no dia da aula.
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View, 
  Image, 
  Alert, 
  Platform, 
  ScrollView,
  KeyboardAvoidingView 
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { InputComponent } from "@/components/InputComponent";
import { useDateStore } from "@/stores/DateStore";
import { Periods, Room } from "@/utils/room";
import { PickerInput } from "@/components/PickerInput";
import { Checkbox } from 'expo-checkbox';
import { allTeachers } from "@/api/service/user.service";
import { useUser } from "@/stores/session";
import { IUser } from "@/interfaces/IUser";
import { createSchedule } from "@/api/service/schedules.service";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { ISchedulesPaylod } from "@/interfaces/ISchedules";
import { HeaderComponent } from "@/components/HeaderComponent";
import { FormErrors, FormState } from "@/interfaces/IFormCalendar";

// Constants
const MAX_TEACHERS = 2;
const MIN_TEACHERS = 1;
const SCHEDULE_TYPE = "CEUZINHO";
const TEACHER_LIST_HEIGHT = 384; // 96 * 4 (96 = h-96 in Tailwind)

export default function NewSchedule() {
    const router = useRouter();
    const { user, token } = useUser();
    const { date, correctedDate } = useDateStore();
    const { setLoad } = useLoading();

    // State management
    const [teachers, setTeachers] = useState<IUser[]>([]);
    const [formState, setFormState] = useState<FormState>({
        theme: "",
        selectedRoomType: "MATERNAL",
        selectedIds: [],
        selectedPeriodsType: "MANHÃ",
        errors: {}
    });
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);

    // Memoized values
    const selectedTeachers = useMemo(() => 
        teachers.filter(teacher => formState.selectedIds.includes(teacher.id)),
        [teachers, formState.selectedIds]
    );

    // Optimized callbacks
    const toggleCheckbox = useCallback((id: number) => {
        setFormState(prev => ({
            ...prev,
            selectedIds: prev.selectedIds.includes(id) 
                ? prev.selectedIds.filter((i) => i !== id) 
                : [...prev.selectedIds, id],
            errors: {} // Clear errors when user makes changes
        }));
    }, []);

    const updateFormField = useCallback((field: keyof Omit<FormState, 'errors' | 'selectedIds'>, value: string) => {
        setFormState(prev => ({
            ...prev,
            [field]: value,
            errors: {} // Clear errors when user makes changes
        }));
    }, []);

    // Load teachers with better error handling
    const loadTeachers = useCallback(async () => {
        if (!token) {
            Alert.alert("Erro", "Token de autenticação não encontrado.");
            return;
        }

        setIsLoadingTeachers(true);
        try {
            const data = await allTeachers(token);
            setTeachers(data.users || []);
        } catch (error) {
            console.error("Error loading teachers:", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de professores. Tente novamente.");
        } finally {
            setIsLoadingTeachers(false);
        }
    }, [token]);

    useEffect(() => {
        loadTeachers();
    }, [loadTeachers]);

    // Enhanced validation
    const validateFields = useCallback((): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!formState.theme.trim()) {
            errors.theme = "Informe o tema da aula.";
            isValid = false;
        }

        if (formState.selectedIds.length < MIN_TEACHERS) {
            errors.teachers = `Selecione pelo menos ${MIN_TEACHERS} professor.`;
            isValid = false;
        }

        if (formState.selectedIds.length > MAX_TEACHERS) {
            errors.teachers = `Você pode selecionar no máximo ${MAX_TEACHERS} professores.`;
            isValid = false;
        }

        setFormState(prev => ({ ...prev, errors }));

        if (!isValid) {
            const errorMessages = Object.values(errors);
            Alert.alert("Campos obrigatórios", errorMessages.join("\n"));
        }

        return isValid;
    }, [formState.theme, formState.selectedIds]);


    // Enhanced save handler with better error handling
    const handleSaveSchedule = useCallback(async () => {
        if (!validateFields()) return;
        if (!token || !user?.[0]?.id) {
            Alert.alert("Erro", "Dados de usuário não encontrados.");
            return;
        }

        setLoad(true);
        try {
            const payload: ISchedulesPaylod = {
                date: correctedDate,
                month: date.split(" ")[2],
                period: formState.selectedPeriodsType,
                tema: formState.theme.trim(),
                scheduleType: SCHEDULE_TYPE,
                createdBy: user[0].id,
                teacherOne: formState.selectedIds[0] || null,
                teacherTwo: formState.selectedIds[1] || null,
                room: formState.selectedRoomType
            };

            await createSchedule(payload, token);
            Alert.alert("Sucesso", "Agendamento salvo com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error("Error saving schedule:", error);
            Alert.alert("Erro", "Não foi possível salvar o agendamento. Verifique sua conexão e tente novamente.");
        } finally {
            setLoad(false);
        }
    }, [validateFields, token, user, correctedDate, date, formState, setLoad, router]);

    // Memoized teacher item renderer for better performance
    const renderTeacherItem = useCallback(({ item }: { item: IUser }) => (
        <View className="flex flex-row items-center gap-3 mb-4 p-2 rounded-lg bg-gray-50">
            <Checkbox
                style={{ width: 24, height: 24 }}
                value={formState.selectedIds.includes(item.id)}
                onValueChange={() => toggleCheckbox(item.id)}
                accessibilityLabel={`Selecionar professor ${item.name}`}
                accessibilityRole="checkbox"
            />
            <View className="w-10 h-10 rounded-full bg-slate-300 border-2 border-slate-200 overflow-hidden">
                {item.photoUrl ? (
                    <Image 
                        source={{ uri: item.photoUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                        accessibilityLabel={`Foto do professor ${item.name}`}
                    />
                ) : (
                    <View className="w-full h-full bg-slate-400 flex items-center justify-center">
                        <Text className="text-white font-semibold text-sm">
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
            <Text className="text-lg flex-1" accessibilityRole="text">
                {item.name}
            </Text>
        </View>
    ), [formState.selectedIds, toggleCheckbox]);

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <HeaderComponent title={date} />
            
            <SafeAreaView className="flex-1">
                <ScrollView 
                    className="flex-1 px-4"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Form Fields */}
                    <View className="py-4">
                        {/* Theme Input */}
                        <View className="mb-6">
                            <Text className="text-xl font-semibold mb-2 text-gray-800">
                                Tema da Aula *
                            </Text>
                            <InputComponent
                                placeholder="Digite o título da matéria"
                                hasIcon={false}
                                value={formState.theme}
                                onChangeText={(text) => updateFormField('theme', text)}
                                keyboardType="default"
                            />
                            {formState.errors.theme && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {formState.errors.theme}
                                </Text>
                            )}
                        </View>

                        {/* Room Selection */}
                        <View className="mb-6">
                            <Text className="text-xl font-semibold mb-2 text-gray-800">
                                Turma
                            </Text>
                            <PickerInput
                                selectInfoType={formState.selectedRoomType}
                                setSelectInfoType={(value) => updateFormField('selectedRoomType', value)}
                                infoObject={Room}
                                labelKey="label"
                                valueKey="value"
                            />
                        </View>

                        {/* Period Selection */}
                        <View className="mb-6">
                            <Text className="text-xl font-semibold mb-2 text-gray-800">
                                Período
                            </Text>
                            <PickerInput
                                selectInfoType={formState.selectedPeriodsType}
                                setSelectInfoType={(value) => updateFormField('selectedPeriodsType', value)}
                                infoObject={Periods}
                                labelKey="label"
                                valueKey="value"
                            />
                        </View>

                        {/* Teachers Selection */}
                        <View className="mb-6">
                            <View className="flex flex-row items-center justify-between mb-3">
                                <Text className="text-xl font-semibold text-gray-800">
                                    Professores *
                                </Text>
                                <Text className="text-sm text-gray-600">
                                    {formState.selectedIds.length}/{MAX_TEACHERS} selecionados
                                </Text>
                            </View>
                            
                            {formState.errors.teachers && (
                                <Text className="text-red-500 text-sm mb-2">
                                    {formState.errors.teachers}
                                </Text>
                            )}

                            <View style={{ height: Platform.OS === 'ios' ? 'auto' : TEACHER_LIST_HEIGHT }}>
                                {isLoadingTeachers ? (
                                    <View className="flex items-center justify-center py-8">
                                        <Text className="text-gray-500">Carregando professores...</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={teachers}
                                        renderItem={renderTeacherItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        showsVerticalScrollIndicator={false}
                                        scrollEnabled={Platform.OS === 'android'}
                                        accessibilityLabel="Lista de professores disponíveis"
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        className="bg-darkPink py-4 px-8 rounded-lg mb-6 mx-auto"
                        onPress={handleSaveSchedule}
                        accessibilityLabel="Salvar agendamento"
                        accessibilityRole="button"
                        accessibilityHint="Salva o agendamento com as informações preenchidas"
                    >
                        <Text className="text-white font-RobotoSemibold text-xl text-center">
                            Salvar Agendamento
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            
            <LoadingComponent />
        </KeyboardAvoidingView>
    );
}
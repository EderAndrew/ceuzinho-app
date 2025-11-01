import { allTeachers } from "@/api/service/user.service";
import { FormState } from "@/interfaces/IFormCalendar"
import { IUser } from "@/interfaces/IUser";
import { useUser } from "@/stores/session";
import Checkbox from "expo-checkbox";
import { useCallback, useState } from "react";
import { View, Text, FlatList, Platform, Image, Alert } from "react-native"

const TEACHER_LIST_HEIGHT = 384; // 96 * 4 (96 = h-96 in Tailwind)


export const TeacherList = () => {
    const [teachers, setTeachers] = useState<IUser[]>([]);
    const [formState, setFormState] = useState<FormState>({
        theme: "",
        selectedRoomType: "MATERNAL",
        selectedIds: [],
        selectedPeriodsType: "MANHÃ",
        errors: {}
    });
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const { user, token } = useUser();

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
    
    return(
        <>
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
        </>
    )
}
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View, Image, Alert, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { InputComponent } from "@/components/InputComponent";
import { useDateStore } from "@/stores/DateStore";
import { Periods, Room } from "@/utils/room";
import { PickerInput } from "@/components/PickerInput";
import { Checkbox } from 'expo-checkbox';
import { useServices } from "@/hooks/useServices";
import { useUser } from "@/stores/session";
import { IUser } from "@/interfaces/IUser";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { ISchedulesPaylod } from "@/interfaces/ISchedules";
import { HeaderComponent } from "@/components/HeaderComponent";

export default function NewCalendar() {
    const router = useRouter();
    const { user, token } = useUser()
    const { date, correctedDate } = useDateStore()
    const { user: userService, schedule } = useServices()
    const [teachers, setTeachers] = useState<IUser[]>([])
    const [theme, setTheme] = useState("")
    const [selectedRoomType, setSelectedRoomType] = useState("MATERNAL");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedPeriodsType, setSelectedPeriodsType] = useState("MANHÃ")
    const {setLoad} = useLoading()

    const toggleCheckbox = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    useEffect(()=>{
        (async()=>{
            try{
                const result = await userService.getUsersByRole("TEACHER", token as string)
                if (result.success) {
                    setTeachers(result.data)
                }
            }catch(error){
                Alert.alert("Erro ao carregar os professores.")
            }
        })()
    },[])

    const validateFields = () => {
        if (!theme.trim()) {
        Alert.alert("Campo obrigatório", "Informe o tema da aula.");
        return false;
        }
        if (selectedIds.length === 0) {
        Alert.alert("Campo obrigatório", "Selecione pelo menos um professor.");
        return false;
        }
        if(selectedIds.length > 2){
            Alert.alert("Limite excedido", "Você pode selecionar no máximo dois professores.");
            return false;
        }
        return true;
    };


    const handlerCalendar = async() => {
        if (!validateFields()) return;

        setLoad(true)
        try{
             const payload = {
                date: correctedDate,
                month: date.split(" ")[2],
                period: selectedPeriodsType,
                tema: theme,
                scheduleType: "CEUZINHO",
                createdBy: user?.[0].id,
                teacherOne: selectedIds[0] || null,
                teacherTwo: selectedIds[1] || null,
                room: selectedRoomType
            } as ISchedulesPaylod

            console.log(payload)
            const result = await schedule.createSchedule(payload, token as string)
            
            if (result.success) {
                router.back()
            } else {
                Alert.alert("Erro", result.error || "Não foi possível salvar o agendamento.");
            }
        }catch(error){
           Alert.alert("Erro", "Não foi possível salvar o agendamento.");
        }finally{
            setLoad(false)
        }
    }

    return (
        <View className="flex-1 bg-white px-4">
            <HeaderComponent 
                title={date}
            />
            <SafeAreaView className="flex-1 justify-between">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-1">
                    <View className="mb-4">
                        <Text className="text-xl">Tema</Text>
                        <InputComponent
                            placeholder="Titulo da matéria"
                            hasIcon={false}
                            value={theme}
                            onChangeText={(text) => setTheme(text)}
                            keyboardType="default"
                        />
                    </View>
                    <View>
                        <Text className="text-xl">Turma</Text>
                        <PickerInput
                            selectInfoType={selectedRoomType}
                            setSelectInfoType={setSelectedRoomType}
                            infoObject={Room}
                            labelKey="label"
                            valueKey="value"
                        />
                    </View>
                    <View className="mt-4">
                        <Text className="text-xl">Período</Text>
                        <PickerInput
                            selectInfoType={selectedPeriodsType}
                            setSelectInfoType={setSelectedPeriodsType}
                            infoObject={Periods}
                            labelKey="label"
                            valueKey="value"
                        />
                    </View>
                    <View className={Platform.select({
                        ios: "flex-1 gap-3 mt-4",
                        android: "flex-1 gap-3 mt-4 h-96"
                    })}>
                        <Text className="text-xl">Professores</Text>
                        <FlatList
                            data = {teachers}
                            renderItem={({item})=>(
                                <View className="flex flex-row items-center gap-2 mb-4">
                                    <Checkbox
                                        style={{width: 24, height: 24}}
                                        value={selectedIds.includes(item.id)}
                                        onValueChange = {() => toggleCheckbox(item.id)}
                                    />
                                    <View className="w-8 h-8 rounded-full bg-slate-400 border">
                                        {item.photoUrl && (
                                            <Image 
                                                source={{ uri: item?.photoUrl }}
                                                className="w-full h-full rounded-full"
                                                resizeMode="cover"
                                            />
                                        )}
                                        
                                    </View>
                                    <Text className="text-xl">{item.name}</Text>
                                </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />    
                    </View>
                </View>
                <TouchableOpacity
                    className="flex m-auto mb-6"
                    onPress={handlerCalendar}
                >
                    <Text className="text-darkPink font-RobotoSemibold text-xl">Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
            </SafeAreaView>
            <LoadingComponent />
        </View>
    )
}
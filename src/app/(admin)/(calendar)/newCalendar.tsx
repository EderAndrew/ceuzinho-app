import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View, Image, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function NewCalendar() {
    const router = useRouter();
    const { user, token } = useUser()
    const { date, correctedDate } = useDateStore()
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
                const data = await allTeachers(token as string)
                setTeachers(data.users)
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
            await createSchedule(payload, token as string)

            router.back()
        }catch(error){
           Alert.alert("Erro", "Não foi possível salvar o agendamento.");
        }finally{
            setLoad(false)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <View className="flex flex-row gap-4">
                <TouchableOpacity onPress={()=>router.back()}>
                    <MaterialIcons size={32} name={"arrow-back"} color={"#334155"} />
                </TouchableOpacity>
                <Text className="w- text-3xl font-RobotoBold text-slate-700">{date}</Text>
            </View>
            <View className="flex h-full mt-10 gap-4">
                <View className="gap-4">
                    <View>
                        <Text className="text-xl">Sala</Text>
                        <PickerInput
                            selectInfoType={selectedRoomType}
                            setSelectInfoType={setSelectedRoomType}
                            infoObject={Room}
                            labelKey="label"
                            valueKey="value"
                        />
                    </View>
                    <View>
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
                        <Text className="text-xl">Periodo</Text>
                        <PickerInput
                            selectInfoType={selectedPeriodsType}
                            setSelectInfoType={setSelectedPeriodsType}
                            infoObject={Periods}
                            labelKey="label"
                            valueKey="value"
                        />
                    </View>
                    <View className="gap-3">
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
                    className="flex m-auto"
                    onPress={handlerCalendar}
                >
                    <Text className="text-darkPink font-RobotoSemibold text-xl">Salvar</Text>
                </TouchableOpacity>
            </View>
            <LoadingComponent />
        </SafeAreaView>
    )
}
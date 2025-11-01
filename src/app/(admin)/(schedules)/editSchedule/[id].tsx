import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderComponent } from "@/components/HeaderComponent";
import { useEffect, useState } from "react";
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
    const [schedule, setSchedule] = useState<ISchedules>()
    const { id } = useLocalSearchParams<{ id: string }>()
    const {setLoad} = useLoading()
    const { token } = useUser();
    
    useEffect(()=>{
        (async()=>{
            setLoad(true)
            try{
                const data = await getScheduleById(Number(id), token as string)
                if(!data.data) return
                setSchedule(data.data)
            }catch(error){
                console.error(error)
            }finally{
                setLoad(false)
            }
            
        })()
    },[])
    
    return(
        <View className="bg-white flex-1 p-4">
            <SafeAreaView className="flex-1 gap-2">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <HeaderComponent
                        title="Editar Calendário"
                    />
                    <View>
                        <Text className="font-RobotoSemibold text-lg text-slate-700">Data</Text>
                        <View className="h-14 justify-between p-2 border border-slate-400 rounded-md flex-row items-center">
                            <TextInput
                                className="text-xl w-80 text-slate-800"                          
                                value={new Date(schedule?.date.split("T")[0] as string).toLocaleDateString()}
                            />
                            <TouchableOpacity className="bg-slate-200 p-2 rounded-md items-center justify-center">
                                <MaterialIcons size={18} name="calendar-month" color={"#9c9c9c"} />
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    <View>
                        <Text className="font-RobotoSemibold text-lg text-slate-700">Tema</Text>
                        <InputComponent 
                            hasIcon={false}
                            value={schedule?.tema as string}
                            onChangeText={(text) => console.log(text)}
                        />
                    </View>
                    <View>
                        <Text className="font-RobotoSemibold text-lg text-slate-700">Turma</Text>
                        <PickerInput
                            selectInfoType={schedule?.room as string}
                            setSelectInfoType={(value) => console.log(value)}
                            infoObject={Room}
                            labelKey="label"
                            valueKey="value"
                        />
                    </View>
                    <View>
                        <Text className="font-RobotoSemibold text-lg text-slate-700">Periodo</Text>
                        <PickerInput
                            selectInfoType={schedule?.period as string}
                            setSelectInfoType={(value) => console.log(value)}
                            infoObject={Periods}
                            labelKey="label"
                            valueKey="value"
                        />
                    </View>
                    <View className="mb-6">
                        <Text className="font-RobotoSemibold text-lg text-slate-700">Professores</Text>
                        <TeacherList 
                        />
                    </View>
                    <TouchableOpacity className="w-[100%] bg-darkPink py-4 px-8 rounded-lg mb-6 mx-auto">
                        <Text className="text-white font-RobotoSemibold text-xl text-center">Editar</Text>
                    </TouchableOpacity>
                </ScrollView>
                
            </SafeAreaView>
            <LoadingComponent />
        </View>
    )
}
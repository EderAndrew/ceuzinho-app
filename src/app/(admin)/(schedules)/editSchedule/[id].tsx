import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderComponent } from "@/components/HeaderComponent";
import { useEffect, useState } from "react";
import { useUser } from "@/stores/session";
import { getScheduleById } from "@/api/service/schedules.service";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useLoading } from "@/stores/loading";
import { ISchedules } from "@/interfaces/ISchedules";

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
        <SafeAreaView className="flex-1 p-4">
            <HeaderComponent
                title="Editar Calendário"
            />
            <Text>Data</Text>
            <TextInput
                className="border rounded-md"
                value={schedule?.date}
            />
            <Text>Tema</Text>
            <TextInput
                className="border rounded-md"
                value={schedule?.tema}
            />
            <Text>Turma</Text>
            <TextInput
                className="border rounded-md"
                value={schedule?.room}
            />
            <Text>Periodo</Text>
            <TextInput
                className="border rounded-md"
                value={schedule?.period}
            />
            <View>
                <Text>Professores</Text>
                <View>
                    
                </View>
            </View>
            <LoadingComponent />
        </SafeAreaView>
    )
}
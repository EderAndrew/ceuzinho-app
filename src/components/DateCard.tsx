import { View, Text, TouchableOpacity, Image } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { ISchedules } from "@/interfaces/ISchedules"
import { useRouter } from "expo-router"

type Props = {
    data: ISchedules
}
export const DateCard = ({data}: Props) => {
    const router = useRouter()
    
    const handlerEditSchedule = (id: number) => {
        if(String(data.status) !== "AGUARDANDO") return
        router.navigate(`/editCalendar/${id}`)
    }

    const handlerDeleteSchedule = (id: number) => {
        if(String(data.status) !== "AGUARDANDO") return
        console.log("DELETE CARD: ", id)
    }

    return (
        <View className="w-full flex-row bg-[#E9E9E9] mt-4 border border-slate-400 rounded-lg">
            <View className={`p-2 rounded-tl-lg rounded-bl-lg justify-center items-center`}
                style={{ backgroundColor: data.bgColor, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                <Text className="text-white font-semibold text-xl">{data.timeStart}</Text>
                <Text className="text-white font-semibold text-xl">{data.timeEnd}</Text>
                <Text className="text-white font-semibold text-xl">{data.status.toLowerCase()}</Text>
            </View>
            <View className="flex-1 ml-4 justify-around gap-2">
                <Text className="font-semibold text-lg">{data.tema}</Text>
                <View className="flex-1 flex-row gap-2">
                    <View className="flex-row relative">
                        <View className="absolute z-10 top-0 left-0 w-10 h-10 bg-slate-500 rounded-full border">
                            <Image source={{uri: `${data.teacherOneUser.photoUrl}`}} className="w-10 h-10 rounded-full border" />
                        </View>
                        <View className="absolute z-0 top-0 left-6 w-10 h-10 bg-slate-500 rounded-full border">
                            <Image source={{uri: `${data.teacherTwoUser.photoUrl}`}} className="w-10 h-10 rounded-full border" />
                        </View>
                    </View>
                    <View className="ml-16">
                        <Text>{data.teacherOneUser.name}</Text>
                        <Text>{data.teacherTwoUser.name}</Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text>Periodo da {data.period.toLowerCase()}</Text>
                    <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity onPress={()=>handlerEditSchedule(data.id)}>
                            <MaterialIcons size={24} name={"edit"} color={String(data.status) === "AGUARDANDO" ? "#043a68" : "#9F9D9E"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handlerDeleteSchedule(data.id)}>
                            <MaterialIcons size={24} name={"delete"} color={String(data.status) === "AGUARDANDO" ? "#df1b7d" : "#9F9D9E"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
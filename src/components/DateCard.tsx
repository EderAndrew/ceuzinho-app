import { View, Text, TouchableOpacity } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { ISchedules } from "@/interfaces/ISchedules"

type Props = {
    data: ISchedules
}
export const DateCard = ({data}: Props) => {
    return (
        <View className="w-full flex-row bg-[#E9E9E9] mt-4 border border-slate-400 rounded-lg">
            <View className="bg-[#EBBC16] p-2 rounded-tl-lg roundend-bl-lg justify-center items-center">
                <Text className="text-white font-semibold text-xl">9:00</Text>
                <Text className="text-white font-semibold text-xl">10:00</Text>
                <Text className="text-white font-semibold text-xl">Finalizado</Text>
            </View>
            <View className="flex-1 ml-4 justify-around gap-2">
                <Text className="font-semibold text-lg">Titulo da matéria</Text>
                <View className="flex-1 flex-row gap-2">
                    <View className="flex-row relative">
                        <View className="absolute z-10 top-0 left-0 w-10 h-10 bg-slate-500 rounded-full border"></View>
                        <View className="absolute z-0 top-0 left-6 w-10 h-10 bg-slate-500 rounded-full border"></View>
                    </View>
                    <View className="ml-16">
                        <Text>Professor 1</Text>
                        <Text>Professor 2</Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text>Periodo da Manhã</Text>
                    <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity>
                            <MaterialIcons size={24} name={"edit"} color={"#9F9D9E"} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialIcons size={24} name={"delete"} color={"#9F9D9E"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
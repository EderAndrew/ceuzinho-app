import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from "react";
import { InputComponent } from "@/components/InputComponent";
import { useDateStore } from "@/stores/DateStore";
import { IFormCalendar } from "@/interfaces/IFormCalendar";
import { DropDown } from "@/components/DropDown";
import { Room } from "@/utils/room";

export default function NewCalendar() {
    const router = useRouter();
    const [dateInfo, setDateInfo] = useState(new Date());
    const { date } = useDateStore()
    const [formCalendar, setFormCalendar] = useState<IFormCalendar>()

    const onChange = (_event: any, selectedDate: any) => {
        const currentDate = selectedDate
        setDateInfo(currentDate)
    }

    const showMode = (currentMode: any) => {
        DateTimePickerAndroid.open({
            value: dateInfo,
            onChange,
            mode: currentMode,
            is24Hour: true
        })
    }

    const showDatePicker = () => {
        showMode('date')
    }

    const showTimePicker = () => {
        showMode('time')
    }

    const formattedRoom = Room.map((r) => ({
        value: r.label,
        label: r.label
    }))
    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <View className="flex flex-row gap-4">
                <TouchableOpacity onPress={()=>router.back()}>
                    <MaterialIcons size={32} name={"arrow-back"} color={"#334155"} />
                </TouchableOpacity>
                <Text className="w- text-3xl font-RobotoBold text-slate-700">{date}</Text>
            </View>
            <View className="flex mt-10 gap-4">
                <View>
                    <Text className="text-xl">Sala</Text>
                    <DropDown
                        data={formattedRoom}
                        onChange={console.log}
                        placeholder="Selecione a Sala"
                    />
                </View>
                <View>
                    <Text className="text-xl">Tema</Text>
                    <InputComponent
                        placeholder="Titulo da matéria"
                        hasIcon={false}
                        value={formCalendar?.theme as string}
                        onChangeText={(text) => console.log(text)}
                        keyboardType="default"
                    />
                </View>
                
            </View>
            <Button onPress={showTimePicker} title="Show time picker!" />
        </SafeAreaView>
    )
}
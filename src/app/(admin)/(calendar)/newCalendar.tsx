import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from "react";
import { InputComponent } from "@/components/InputComponent";

export default function NewCalendar() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());

    const onChange = (_event: any, selectedDate: any) => {
        const currentDate = selectedDate
        setDate(currentDate)
    }

    const showMode = (currentMode: any) => {
        DateTimePickerAndroid.open({
            value: date,
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

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <View className="flex flex-row gap-4">
                <TouchableOpacity onPress={()=>router.back()}>
                    <MaterialIcons size={32} name={"arrow-back"} color={"#334155"} />
                </TouchableOpacity>
                <Text className="text-3xl font-RobotoBold text-slate-700">Quinta feira, 18 Set</Text>
            </View>
            <View>
                <InputComponent
                    hasIcon={false}
                    value={new Date(date).toLocaleDateString("pt-BR")}
                    
                />
                <Button onPress={showDatePicker} title="Show date picker!" />
                <Button onPress={showTimePicker} title="Show time picker!" />
                <Text>selected: {date.toLocaleString()}</Text> 
            </View>
        </SafeAreaView>
    )
}
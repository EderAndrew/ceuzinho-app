import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, TouchableOpacity, View, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from "react";
import { InputComponent } from "@/components/InputComponent";
import { useDateStore } from "@/stores/DateStore";
import { IFormCalendar } from "@/interfaces/IFormCalendar";
import { Room } from "@/utils/room";
import { PickerInput } from "@/components/PickerInput";
import { Checkbox } from 'expo-checkbox';
import { allTeachers } from "@/api/service/user.service";
import { useUser } from "@/stores/session";
import { IUser } from "@/interfaces/IUser";

export default function NewCalendar() {
    const router = useRouter();
    const { token } = useUser()
    const [dateInfo, setDateInfo] = useState(new Date());
    const { date } = useDateStore()
    const [formCalendar, setFormCalendar] = useState<IFormCalendar>()
    const [teachers, setTeachers] = useState<IUser[]>([])
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [isChecked, setChecked] = useState(false);

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

    const showTimePicker = () => {
        showMode('time')
    }

    useEffect(()=>{
        (async()=>{
            const data = await allTeachers(token as string)
            setTeachers(data.users)
        })()
    },[])

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
                        value={formCalendar?.theme as string}
                        onChangeText={(text) => console.log(text)}
                        keyboardType="default"
                    />
                </View>
                <View>
                    <Text className="text-xl">Periodo</Text>
                    <PickerInput
                        selectInfoType={selectedRoomType}
                        setSelectInfoType={setSelectedRoomType}
                        infoObject={Room}
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
                                    value={isChecked}
                                    onValueChange = {() => setChecked(!isChecked)}
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
        </SafeAreaView>
    )
}
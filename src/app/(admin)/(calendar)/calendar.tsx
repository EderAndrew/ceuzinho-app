import { Calendars } from "@/components/Calendars";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { DateCard } from "@/components/DateCard";

export default function Calendar(){
    const [dateNow, setDateNow] = useState(new Date().toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                year: 'numeric', 
                month: 'short', 
                day: '2-digit'
            }).split(", ")[0]);

    return(
        <SafeAreaView className="flex-1 bg-white">
            <Calendars
                dateNow={dateNow}
                setDateNow={setDateNow}
            />
            <ScrollView className="p-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl">{dateNow}</Text>
                    <TouchableOpacity className="bg-cgreen rounded-full p-1">
                        <MaterialIcons size={28} name={"add"} color={"#FFF"} />
                    </TouchableOpacity>
                </View>
                <DateCard />
            </ScrollView>
        </SafeAreaView>
    )
}
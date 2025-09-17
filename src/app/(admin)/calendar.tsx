import { Calendars } from "@/components/Calendars";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calendar(){
    return(
        <SafeAreaView className="flex-1 bg-white">
            <Calendars />
        </SafeAreaView>
    )
}
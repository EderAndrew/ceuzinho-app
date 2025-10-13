import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditCalendar() {
    const { id } = useLocalSearchParams<{ id: string }>()
    return(
        <SafeAreaView>
            <Text>Schedule: {id}</Text>
        </SafeAreaView>
    )
}
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRouter } from "expo-router";

export default function NewCalendar() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            <View className="flex flex-row gap-4">
                <TouchableOpacity onPress={()=>router.back()}>
                    <MaterialIcons size={32} name={"arrow-back"} color={"#334155"} />
                </TouchableOpacity>
                <Text className="text-3xl font-RobotoBold text-slate-700">Quinta feira, 18 Set</Text>
            </View>
            <View>
                <TextInput
                    className=""
                    onChangeText={(text) => console.log(text)}
                    value={""}
                    keyboardType="numeric"
                    
                />
            </View>
        </SafeAreaView>
    )
}
import { useRouter } from "expo-router"
import { TouchableOpacity, View, Text } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
    title: string
    btnBack?: boolean
}

export const HeaderComponent = ({title, btnBack = true}: Props) => {
    const route = useRouter()
    
    return (
        <View className="flex flex-row items-center gap-2">
            {btnBack && 
                <TouchableOpacity className="p-2" onPress={()=> route.back()}>
                    <MaterialIcons size={38} name='arrow-back' color={"#1e293b"} />
                </TouchableOpacity>
            }
            <Text className="text-3xl font-RobotoBold text-slate-800">{title}</Text>
        </View>
    )
}
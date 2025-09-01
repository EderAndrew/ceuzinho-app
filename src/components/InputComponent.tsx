import { TextInput, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap
    placeholder: string
    value: string
    onChangeText: (text: string) => void
    keyboardType: "email-address" | "default"
    secureTextEntry?: boolean
}
export const InputComponent = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    keyboardType, 
    secureTextEntry = false 
}: Props) => {
    return (
        <View className="w-96 h-14 mt-6 border border-slate-400 bg-white rounded-lg flex-row items-center">
            <MaterialIcons size={28} name={icon} color={"#9c9c9c"} />
            <TextInput
                className="font-RobotoRegular text-xl w-[100%] text-slate-800"                          
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={"#9c9c9c"}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}
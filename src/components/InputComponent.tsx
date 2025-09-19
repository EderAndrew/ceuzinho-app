import { TextInput, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

type Props = {
    hasIcon?: boolean
    icon?: keyof typeof MaterialIcons.glyphMap
    placeholder?: string
    value: string
    onChangeText: (text: string) => void
    keyboardType?: "email-address" | "default"
    secureTextEntry?: boolean
    style?: string
}
export const InputComponent = ({
    hasIcon = true,
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    keyboardType = "default", 
    secureTextEntry = false,
    style = "w-full"
}: Props) => {
    return (
        <View className={`${style} h-14 border border-slate-400 bg-white rounded-lg flex-row items-center`}>
            {hasIcon && (<MaterialIcons size={28} name={icon} color={"#9c9c9c"} />)}
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
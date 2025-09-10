import { TouchableOpacity, Text } from "react-native"

type Props = {
    bgColor: string
    handleLogin: () => void
    title: string
}

export const ButtonComponent = ({ bgColor, handleLogin, title }:Props) => {
    return(
        <TouchableOpacity
            className={`w-96 h-14 flex justify-center items-center rounded-lg ${bgColor}`}
            onPress={handleLogin}
        >
            <Text className="font-RobotoRegular text-white font-normal text-xl">{title}</Text>
        </TouchableOpacity>
    )
}
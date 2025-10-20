import { icon } from "@/constants/icons"
import { useEffect } from "react"
import { Pressable } from "react-native"
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

type Props = {
    onPress: () => void,
    onLongPress: () => void,
    isFocused: boolean,
    routeName: string,
    color:string,
    label:string

}

export const TabBarButton = ({onPress, onLongPress, isFocused, routeName, color, label}:Props) => {
    const scale = useSharedValue(0)

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, {
            duration: 350
        })
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2])
        const top = interpolate(scale.value, [0,1], [0, 9])

        return {
            transform: [{
                scale: scaleValue
            }],
            top
        }
    })
    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0])

        return { opacity }
    })
    return (
            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                className="flex-1 flex justify-center items-center p-2"
            >   
            <Animated.View style={animatedIconStyle}>
                {icon[routeName as keyof typeof icon]?.({
                    color: isFocused ? "#fff" : "#fff"
                })}
            </Animated.View>
            <Animated.Text style={[{color: isFocused ? "#df1b7d" : "#fff", fontSize: 12}, animatedTextStyle]}>
                {label as string}
            </Animated.Text>
        </Pressable>
    )
}
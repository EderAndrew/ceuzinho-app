import { View, Text } from "react-native"
import { OtpInput } from "react-native-otp-entry"

export const OtpComponent = () => {
    return (
        <OtpInput
            numberOfDigits={6}
            focusColor="green"
        />
    )
}
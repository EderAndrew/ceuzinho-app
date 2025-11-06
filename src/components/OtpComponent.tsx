import { View, Text } from "react-native"
import { OtpInput } from "react-native-otp-entry"

type props = {
    onTextChange: (text: string) => void
}

export const OtpComponent = ({ onTextChange }: props) => {
    return (
        <OtpInput
            numberOfDigits={6}
            focusColor="green"
            type="numeric"
            onTextChange={onTextChange}
        />
    )
}
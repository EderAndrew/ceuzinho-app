import { View, Text } from "react-native"
import { InputComponent } from "./InputComponent"

type Props = {
    password: string
    repeatPassword: string
    handleInputChange: (field: string, value: string) => void
    renderFieldError: (field: string) => React.ReactNode
}

export const ChangePasswordComponent = ({ 
    password, 
    repeatPassword, 
    handleInputChange, 
    renderFieldError,
}: Props) => {
    return (
        <View className="gap-4">
            <View>
                <InputComponent 
                  icon="lock"
                  placeholder="Digite sua senha"
                  value={password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  keyboardType="default"
                  secureTextEntry={true}
                />
                {renderFieldError('password')}
            </View>
            <View className="mb-6">
                <InputComponent 
                  icon="lock"
                  placeholder="Repita a senha"
                  value={repeatPassword}
                  onChangeText={(text) => handleInputChange('repeatPassword', text)}
                  keyboardType="default"
                  secureTextEntry={true}
                />
                {renderFieldError('password')}
            </View>
        </View>
    )
}
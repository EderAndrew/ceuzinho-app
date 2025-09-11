import { Modal, SafeAreaView, View, Text, TouchableOpacity } from "react-native"
import { ButtonComponent } from "./ButtonComponent"

type Props = {
    visible: boolean
    handleLogout: () => void
}
export const ModalResetPassword = ({visible, handleLogout}:Props) => {
    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
        >
            <View className="bg-slate-900/30 flex-1 justify-end items-center">
                <View className="bg-white h-2/4 w-full rounded-s-2xl items-center justify-around">
                    <View className="items-center gap-2">
                        <Text className="text-2xl text-cgreen font-RobotoSemibold">Senha alterada com sucesso!</Text>
                        <Text className="text-xl">Faça o login novamente com a nova senha</Text>
                    </View>
                    <ButtonComponent
                        bgColor="bg-darkBlue"
                        title="Finalizar"
                        handleLogin={handleLogout}
                    />
                </View>
            </View>
            
        </Modal>
       
    )
}
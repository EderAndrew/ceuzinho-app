import { useLoading } from "@/stores/loading"
import { ActivityIndicator, Modal, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const LoadingComponent = () => {
    const {load} = useLoading()

    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={load}
        >
            <View className="flex-1 items-center justify-center bg-black/30">
                <ActivityIndicator size="large" color="#018bba" />
                <Text className="mt-2 text-xl font-RobotoRegular">Carregando...</Text>
            </View>
        </Modal>
    )
}
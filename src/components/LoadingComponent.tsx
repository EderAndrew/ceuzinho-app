import { useLoading } from "@/stores/loading"
import { ActivityIndicator, Modal, SafeAreaView, Text, View } from "react-native"

export const LoadingComponent = () => {
    const {load} = useLoading()

    return(
        <SafeAreaView>
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
        </SafeAreaView>
        
    )
}
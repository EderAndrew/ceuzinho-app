import { CameraView, CameraType} from 'expo-camera';
import { SafeAreaView } from "react-native-safe-area-context"
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useState } from 'react';

type Props = {
    visible: boolean,
    setVisible: (value: boolean) => void
}

export const CameraModal = ({visible, setVisible}: Props) => {
    const [facing, setFacing] = useState<CameraType>('front');
    const [changeCamera, setChangeCamera] = useState(false)

    const handleChangeCamera = () => {
        setChangeCamera(!changeCamera)
        if(!changeCamera) setFacing('back')
        else setFacing('front')
    }
    
    return(
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
        >
            <CameraView style={styles.container} facing={facing}/>
            <SafeAreaView className="flex-1 absolute justify-between items-center w-full h-full py-3">
                <View className="w-full flex flex-row justify-between px-4">
                    <TouchableOpacity className="p-2 rounded-full bg-white" onPress={()=>setVisible(false)}>
                        <MaterialIcons size={28} name={"arrow-back"} color={"#9c9c9c"} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full bg-white" onPress={handleChangeCamera}>
                        <MaterialIcons size={28} name={"cameraswitch"} color={"#9c9c9c"} />
                    </TouchableOpacity>
                </View>                
                <TouchableOpacity className="p-2 rounded-full bg-white" onPress={()=>setVisible(false)}>
                    <MaterialIcons size={48} name={"photo-camera"} color={"#9c9c9c"} />
                </TouchableOpacity>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
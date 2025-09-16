import { CameraView, CameraType } from 'expo-camera';
import { SafeAreaView } from "react-native-safe-area-context"
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useRef, useState } from 'react';
import { usePhoto } from '@/stores/photo';

type Props = {
    visible: boolean,
    setVisible: (value: boolean) => void
}

export const CameraModal = ({visible, setVisible}: Props) => {
    const [cameraReady, setCameraReady] = useState(false);
    const [facing, setFacing] = useState<CameraType>('front');
    const [changeCamera, setChangeCamera] = useState(false)
    const cameraRef = useRef<CameraView>(null)
    const { setImage, setUpPhoto } = usePhoto()

    const handleChangeCamera = () => {
        setChangeCamera(!changeCamera)
        if(!changeCamera) setFacing('back')
        else setFacing('front')
    }

    const handleCameraReady = () => {
        setCameraReady(true);
    }

    const handleTakePhoto = async () => {
        if(cameraRef.current && cameraReady){
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
            const uriPath = photo.uri.split('/');
            
            const file = {
                uri: photo.uri,
                fileName: uriPath[uriPath.length - 1],
                mimeType: 'image/jpg'
            }
        
            if(photo){
                setUpPhoto(file)
                setImage(photo.uri)
                setCameraReady(false)
            }
            
            setVisible(false)
        }
    }
    
    return(
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
        >
            <CameraView
                ref={cameraRef}
                style={styles.container}
                facing={facing}
                onCameraReady={handleCameraReady}    
            />
            <SafeAreaView className="flex-1 absolute justify-between items-center w-full h-full py-3">
                <View className="w-full flex flex-row justify-between px-4">
                    <TouchableOpacity className="p-2 rounded-full bg-white" onPress={()=>setVisible(false)}>
                        <MaterialIcons size={28} name={"arrow-back"} color={"#9c9c9c"} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full bg-white" onPress={handleChangeCamera}>
                        <MaterialIcons size={28} name={"cameraswitch"} color={"#9c9c9c"} />
                    </TouchableOpacity>
                </View>                
                <TouchableOpacity className="p-2 rounded-full bg-white" onPress={handleTakePhoto}>
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
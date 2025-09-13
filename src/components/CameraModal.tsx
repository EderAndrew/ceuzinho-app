import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet } from "react-native"
import { useState } from 'react';

export const CameraModal = () => {
    const [facing, setFacing] = useState<CameraType>('front');
    
    return(
        <SafeAreaView className="flex-1 justify-center">
            <CameraView style={styles.container} facing={facing}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
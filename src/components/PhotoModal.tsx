import { Image, Modal, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react"
import { uploadImage } from "@/api/service/user.service";
import { useUser } from "@/stores/session";
import { useLoading } from "@/stores/loading";
import { userSession } from "@/api/service/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-image-picker";
import { usePhoto } from "@/stores/photo";

type Props = {
    userId: string
    visible: boolean,
    setVisible: (value: boolean) => void
    openCamera: (value: boolean) => void
}

export const PhotoModal = ({ userId, visible, setVisible, openCamera }:Props) => {
    //const [upPhoto, setUpPhoto] = useState<ImagePicker.ImagePickerAsset>()
    const [errorMessage, setErrorMessage] = useState("")
    const [permission, requestPermission] = useCameraPermissions()
    const { token, setUser } = useUser()
    const { setLoad } = useLoading()
    const { image, setImage, upPhoto, setUpPhoto } = usePhoto()
  
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setUpPhoto(result.assets[0]);
            setImage(result.assets[0].uri);
        }
    }

    const uploadPhoto = async () => {
        setLoad(true)
        if (!upPhoto) {
            setLoad(false)
            console.error("No photo selected for upload.");
            return;
        }
        
        const file: any = {
            uri: upPhoto.uri,
            name: upPhoto.fileName,
            type: upPhoto.mimeType
        };
        console.log(file)
        const response = await uploadImage(userId, file, token!);

        if(!response){
            setLoad(false)
            setErrorMessage("Erro ao enviar imagem.")
            return 
        }

        const resp = await userSession(token!)
        if (resp?.user) {
            await AsyncStorage.removeItem("user")
            setUser([resp.user])
        }
        closeModal()
        setLoad(false)
        
    }
    const handleCameraPermission = async () => {
        if (!permission) return

        if(permission.granted){
            openCamera(true)
        }
    }

    const closeModal = () => {
        setVisible(false)
        setImage("")
        setErrorMessage("")
    }

    return(
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
        >
            <View className="bg-slate-900/30 flex-1 justify-end items-center">
                <View className="justify-around bg-white w-full h-2/3 rounded-s-2xl mt-4 items-center border border-slate-300">
                    <View className="gap-10 flex w-full items-center justify-center">
                        <TouchableOpacity className="flex flex-row items-center gap-2" onPress={pickImage}>
                            <Text className="text-xl text-darkBlue font-RobotoBold">Carregar Imagem</Text>
                            <MaterialIcons size={28} name="upload" color={"#043a68"} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-row items-center gap-2" onPress={handleCameraPermission}>
                            <Text className="text-xl text-pink font-RobotoBold">Tirar uma nova foto</Text>
                            <MaterialIcons size={28} name="photo-camera-front" color={"#f065a6"} />
                        </TouchableOpacity>
                        {image ?(
                            <TouchableOpacity
                                className="border-2 border-cbrown w-52 h-48 rounded-lg "
                                onPress={uploadPhoto}>
                                <Image
                                    className="w-full h-full rounded-lg"
                                    source={{uri: image as string}}
                                    resizeMode="cover"
                                />
                                <View className="absolute bg-slate-400/15 w-full h-full items-center justify-center">
                                    <MaterialIcons size={28} name="upload" color={"#94a3b8"} />
                                </View>
                            </TouchableOpacity>
                            
                        ) : (
                            <View className="border-2 border-slate-400 w-52 h-48 rounded-lg justify-center items-center">
                                <MaterialIcons size={48} name="person" color={"#94a3b8"} />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        className="w-72 p-3 justify-center items-center"
                        onPress={closeModal}>
                        <Text className="text-xl font-Roboto text-darkPink">Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
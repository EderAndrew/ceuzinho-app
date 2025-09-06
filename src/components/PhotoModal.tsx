import { Image, Modal, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react"
import { uploadImage } from "@/api/service/user.service";
import { useUser } from "@/stores/session";

type Props = {
    userId: string
    visible: boolean,
    setVisible: (value: boolean) => void
}

export const PhotoModal = ({ userId, visible, setVisible }:Props) => {
    const [image, setImage] = useState<string | null>(null);
    const [upPhoto, setUpPhoto] = useState<ImagePicker.ImagePickerAsset>()
    const { token } = useUser()
    
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

    const uploadPhoto = async() => {
        const response = await uploadImage(userId, upPhoto, token)

        console.log("Retorno: ", response)
    }

    const closeModal = () => {
        setVisible(false)
        setImage("")
    }
    return(
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            onRequestClose={() => {
                setVisible(!visible)
            }}
        >
            <View className="bg-slate-900/30 h-full w-full justify-end items-center">
                <View className="justify-around bg-white w-full h-2/3 rounded-s-2xl mt-4 items-center border border-slate-300">
                    <View className="gap-10 flex w-full items-center justify-center">
                        <TouchableOpacity className="flex flex-row items-center gap-2" onPress={pickImage}>
                            <Text className="text-xl text-darkBlue font-RobotoBold">Carregar Imagem</Text>
                            <MaterialIcons size={28} name="upload" color={"#043a68"} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex flex-row items-center gap-2">
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
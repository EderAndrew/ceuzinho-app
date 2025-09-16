import { create } from "zustand"
import * as ImagePicker from 'expo-image-picker';

type PhotoUpload = {
    uri: string;
    fileName: string;
    mimeType: string
}

type PhotoStore = {
    upPhoto: ImagePicker.ImagePickerAsset | PhotoUpload | null,
    setUpPhoto: (image: ImagePicker.ImagePickerAsset | PhotoUpload | null) => void,
    image: string | null
    setImage: (image: string | null) => void
}

export const usePhoto = create<PhotoStore>((set) => ({
    upPhoto: null,
    setUpPhoto: (data: ImagePicker.ImagePickerAsset | PhotoUpload | null) => set({ upPhoto: data }),
    image: null,
    setImage: (data: string | null) => set({ image: data })
}))
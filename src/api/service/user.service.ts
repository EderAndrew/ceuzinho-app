import { PasswordSchema } from "@/schemas/changePassword.schema";
import { api } from "../connection"
import AsyncStorage from "@react-native-async-storage/async-storage";

type RNFile = {
    uri: string;
    name: string;
    type: string
}

const url = process.env.EXPO_PUBLIC_URL

export const uploadImage = async(userId: string, file: RNFile, token: string) => {
    try{
        const formData = new FormData();
        const payload = {
            uri: file.uri,
            name: file.name,
            type: file.type,
        }
        
        formData.append('document', payload as any);
        
        const response = await fetch(`${url}/users/uploadimage/${userId}`,{
            method: 'PUT',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await response.json()

        return data
    }catch(error){
        console.error("Error Message: ",error)
    }
}

export const uploadPassword = async(payload: PasswordSchema, token: string) => {
    try{
        const resp = await api.put("/users/changePassword", {
            email: payload.email,
            oldPassword: payload.oldPwd,
            newPassword: payload.newPwd,
            repeatePassword: payload.repeatPwd
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return {status: resp.status, message: resp.data}
    }catch(error){
        console.error(error)
    }
}

export const allTeachers = async(token: string) => {
    try{
        const resp = await api.get("/users/all", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return resp.data
    }catch(error){
        console.error(error)
    }
}
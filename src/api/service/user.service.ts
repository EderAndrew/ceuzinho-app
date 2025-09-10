import { api } from "../connection"

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

export const changePassword = async() => {
    try{

    }catch(error){
        console.error(error)
    }
}
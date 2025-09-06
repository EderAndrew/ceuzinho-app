import { api } from "../connection"


export const uploadImage = async(userId: string, file: any, token: string) => {
    try{
        const response = await api.put(`/users/uploadimage/${userId}`, {
            document: file
        },{
            headers: {
                'Content-Type':'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    }catch(error){
        console.error(error)
    }
}
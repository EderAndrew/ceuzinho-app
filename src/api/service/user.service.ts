import { api } from "../connection"

export const uploadImage = async(userId: string, file: any) => {
    try{
        const response = await api.put(`/users/uploadimage/${userId}`, {
            document: file
        },{
            headers: {
                'Content-Type':'multipart/form-data'
            }
        })

        return response.data
    }catch(error){

    }
}
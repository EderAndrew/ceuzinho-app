import { ISchedulesPaylod } from "@/interfaces/ISchedules"
import { api } from "../connection"

const url = process.env.EXPO_PUBLIC_URL


export const getSchedulesByDate = async(date: string, token: string) => {
    try{
        const response = await api.get(`/schedules/schedules/${date}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        return response.data
    }catch(error){
        console.error(error)
    }
}

export const createSchedule = async(payload: ISchedulesPaylod, token: string):Promise<any> => {
    try{
        const response = await api.post(`/schedules/createSchedule`, payload,{
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }catch(error){
        console.error("Erro ao criar agendamento:", error);
        throw error; // ou retorne { success: false, error }
    }
}
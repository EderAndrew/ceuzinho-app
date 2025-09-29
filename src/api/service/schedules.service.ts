import { api } from "../connection"

const url = process.env.EXPO_PUBLIC_URL

export const getSchedulesByDate = async(date: string, token: string) => {
    try{
        const response = await api.get(`${url}/schedules/schedules/${date}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        return response.data
    }catch(error){
        console.error(error)
    }
}

export const createSchedule = async(payload: any, token: string) => {
    try{
        const response = await api.post(`${url}/schedules/createSchedule`, payload,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    }catch(error){
        console.error(error)
    }
}
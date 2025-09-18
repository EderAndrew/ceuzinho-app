import { api } from "../connection"

const url = process.env.EXPO_PUBLIC_URL

export const getSchedulesByDate = async(date: string, token: string) => {
    try{
        console.log("date", `${url}/schedules/schedules/${date}`)
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
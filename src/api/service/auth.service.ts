import { LoginSchema } from "@/schemas/login.schema"
import { api } from "../connection"

export const signIn = async(payload: LoginSchema) => {
    try{
        console.log("Payload: ", payload)
        const response = await api.post("/users/signin", {
            email: payload.email,
            password: payload.password
        })

        return response.data
    }catch(error: any){
        if (error.response) {
            // Erro vindo da API (ex: 401, 400, etc.)
            console.log("Erro da API:", error.response.data.message);
            return {
                error: true,
                status: error.response.status,
                message: error.response.data.message || "Erro desconhecido.",
            };
        } 
        if (error.request) {
            // Requisição foi feita mas não houve resposta
            console.log("Sem resposta da API:", error.request);
            return {
                error: true,
                message: "Sem resposta do servidor.",
            };
        } 
         // Erro ao configurar a requisição
         console.log("Erro inesperado:", error.message);
         return {
            error: true,
            message: "Erro inesperado: " + error.message,
        };
    }
}
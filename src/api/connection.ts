import axios from "axios"

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
})
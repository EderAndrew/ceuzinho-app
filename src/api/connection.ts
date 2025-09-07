import axios from "axios"

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_URL,
    timeout:15000,
    headers: {
        "Accept": "/",
        "Content-Type": "application/json"
    }
})
import { IUser } from "@/interfaces/IUser"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type SessionStore = {
    user: IUser[] | null
    setUser: (user: IUser[] | null) => void,
    token: string | null
    setToken: (token: string | null) => void
}

export const useUser = create<SessionStore>()(persist(
    (set) => ({
        user: null,
        token: null,
        setUser: (user) => set(() => ({user})),
        setToken: (token) => set(() => ({token}))
    }),
    {
        name: "user",
        storage: createJSONStorage(() => AsyncStorage)
    }
))
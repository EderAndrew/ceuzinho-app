import { IUser } from "@/interfaces/IUser"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type SessionStore = {
    user: IUser[] | null
    setUser: (user: IUser[] | null) => void
}

export const useUser = create<SessionStore>()(persist(
    (set) => ({
        user: null,
        setUser: (user) => set(() => ({user})),
    }),
    {
        name: "user",
        storage: createJSONStorage(() => AsyncStorage)
    }
))
import { create } from "zustand"


type DateStore = {
    date: string,
    setDate: (date: string) => void,
}

export const useDateStore = create<DateStore>((set) => ({
    date: "",
    setDate: (data: string) => set({ date: data }),
}))
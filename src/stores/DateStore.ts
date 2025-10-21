import { create } from "zustand"


type DateStore = {
    date: string,
    correctedDate: string,
    setDate: (date: string) => void,
    setCorrectedDate: (date: string) => void,
}

export const useDateStore = create<DateStore>((set) => ({
    date: "",
    correctedDate: "",
    setDate: (data: string) => set({ date: data }),
    setCorrectedDate: (data: string) => set({ correctedDate: data })
}))
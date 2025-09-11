import { create } from "zustand"


type LoadingStore = {
    load: boolean,
    setLoad: (data: boolean) => void,
}

export const useLoading = create<LoadingStore>((set) => ({
    load: false,
    setLoad: (data: boolean) => set({ load: data }),
}))
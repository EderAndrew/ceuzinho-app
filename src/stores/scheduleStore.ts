import { create } from "zustand"
import * as ImagePicker from 'expo-image-picker';
import { ISchedules } from "@/interfaces/ISchedules";

type ScheduleStore = {
    schedule: ISchedules[],
    setSchedule: (schedules: ISchedules[]) => void
}

export const useschedule = create<ScheduleStore>((set) => ({
    schedule: [],
    setSchedule: (data: ISchedules[]) => set({ schedule: data })
}))
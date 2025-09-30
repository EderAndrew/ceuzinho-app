export interface ISchedules{
    id: number,
    date: string
    timeStart: string,
    timeEnd: string,
    period: string,
    scheduleType: string,
    room: string,
    tema: string,
    info?: string,
    createdBy: number,
    teatcherOne?: number,
    teatcherTwo?: number,
    ministratorOne?: number,
    ministratorTwo: number,
    document?: string,
    documentUrl?: string,
    bgColor: string,
    createdAt: string,
    updatedAt?: string,
    createdByUser: ICreatedUser,
    teatcherOneUser: ICreatedUser,
    teatcherTwoUser: ICreatedUser,
}

export interface ISchedulesPaylod{
    date: string,
    period: string,
    scheduleType: string,
    tema: string,
    info?: string,
    createdBy: number,
    teatcherOne?: number | null,
    teatcherTwo?: number | null,
    room: string
}

interface ICreatedUser{
    id: number,
    photo?: string,
    photoUrl?: string,
    name: string,
    email: string,
    phone: string
}
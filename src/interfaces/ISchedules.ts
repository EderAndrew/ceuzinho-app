enum Status{
    AGUARDANDO = "Aguardando",
    AULA = "Aula",
    FINALIZADO = "Finalizado",
    CANCELADO = "Cancelado"
}

export interface ISchedules{
    id: number,
    month: string,
    date: string
    timeStart: string,
    timeEnd: string,
    period: string,
    scheduleType: string,
    room: string,
    tema: string,
    status: Status,
    info?: string,
    createdBy: number,
    teacherOne?: number,
    teacherTwo?: number,
    ministratorOne?: number,
    ministratorTwo: number,
    document?: string,
    documentUrl?: string,
    bgColor: string,
    createdAt: string,
    updatedAt?: string,
    createdByUser: ICreatedUser,
    teacherOneUser: ICreatedUser,
    teacherTwoUser: ICreatedUser,
}

export interface ISchedulesPaylod{
    date: string,
    period: string,
    scheduleType: string,
    tema: string,
    info?: string,
    createdBy: number,
    teacherOne?: number | null,
    teacherTwo?: number | null,
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
const MONTH_NUMBER = {
    1: "Jan",
    2: "Fev",
    3: "Mar",
    4: "Abr",
    5: "Mai",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Set",
    10: "Out",
    11: "Nov",
    12: "Dez"
} as const

type MonthType = keyof typeof MONTH_NUMBER

export const monthConvert = (month: number) => {
    const config = MONTH_NUMBER[month as MonthType]

    if(!config){
        console.log("Erro ao verificar o mês.")
        return
    }

    return config
}
export const useDate = (date: Date) => {
    const weekDay: { [key in 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat']: string } = {
        "Sun": "Domingo",
        "Mon": "Segunda",
        "Tue": "Terça",
        "Wed": "Quarta",
        "Thu": "Quinta",
        "Fri": "Sexta",
        "Sat": "Sábado"
    };

    const monthYear: { [key in 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec']: string } = {
        "Jan": "Jan",
        "Feb": "Fev",
        "Mar": "Mar",
        "Apr": "Abr",
        "May": "Mai",
        "Jun": "Jun",
        "Jul": "Jul",
        "Aug": "Ago",
        "Sep": "Set",
        "Oct": "Out",
        "Nov": "Nov",
        "Dec": "Dez"
    }
    
    const day = new Date(date).toUTCString();
    const dayWeek = day.split(", ")[0] as keyof typeof weekDay;
    const dayNumber = day.split(" ")[1]
    const month = day.split(" ")[2] as keyof typeof monthYear;
    
    const dayName = weekDay[dayWeek];
    const yearName = monthYear[month]
    
    const dateFormated = `${dayName}, ${dayNumber} ${yearName}`

    return dateFormated
}
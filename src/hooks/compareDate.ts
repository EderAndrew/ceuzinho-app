export const CompareDate = (now: Date, anotherDate: string) => {
    const infoCompare = new Date(now).toISOString().split("T")[0]
    const dateNowCompare = new Date(infoCompare)
    const anotherDateCompare = new Date(anotherDate)
    
    const compare = anotherDateCompare > dateNowCompare
    return compare
}
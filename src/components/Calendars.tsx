import { useDate } from "@/hooks/useDate";
import { ICalendar } from "@/interfaces/ICalendar";
import { useDateStore } from "@/stores/DateStore";
import { monthConvert } from "@/utils/monthConvert";
import { StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars"

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'sex', 'Sab'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br'

type Props = {
    setData: (date: string) => void,
    handlerSchedulesMonth: (date: string) => void,
    markedMonth: Record<string, any>
}

export const Calendars = ({ setData, handlerSchedulesMonth, markedMonth }:Props) => {  
    const { setDate, setCorrectedDate } = useDateStore()

    const handlerDate = (day: ICalendar) => {
        setData(day.dateString);
        const formatedDate = new Date(day.dateString)
        const stringDate = useDate(formatedDate)
        
        setCorrectedDate(day.dateString)
        setDate(stringDate);
    }

    return (
        <Calendar
            style={styles.container}
            theme={{
                backgroundColor: "#009cd9",
                calendarBackground: "#009cd9",
                textSectionTitleColor: "#ffffff",
                selectedDayBackgroundColor: "#df1b7d",
                todayTextColor: '#ffffff',
                dayTextColor: '#ffffff',
                textDisabledColor: '#ccc',
                textDayHeaderFontFamily: 'Roboto',
                textMonthFontFamily: 'Roboto',
                textDayFontFamily: 'Roboto',
                monthTextColor: '#ffffff',
                arrowColor: '#ffffff',
            }}
            headerStyle={{
                borderBottomWidth: 1,
                borderColor: "#FFF"
            }}
            markedDates={markedMonth}
            onDayPress={day => {
               handlerDate(day)
            }}
            onMonthChange={(month) => {
                const monthC = monthConvert(month.month)
                handlerSchedulesMonth(monthC as string)
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        height: 340,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
})
import { useDate } from "@/hooks/useDate";
import { ICalendar } from "@/interfaces/ICalendar";
import { useDateStore } from "@/stores/DateStore";
import { LocalDate } from "@/utils/localDate";
import { useEffect, useState } from "react";
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
    setData: (date: string) => void
}

export const Calendars = ({ setData }:Props) => {
    const [selected, setSelected] = useState(LocalDate());
    const { setDate, setCorrectedDate } = useDateStore()
    const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
    const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
    const workout = {key: 'workout', color: 'green'};

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
            markedDates={{
                [selected]: {
                    dots: [vacation, massage, workout],
                    selected: true, 
                    selectedColor: '#df1b7d'
                },
                '2025-10-16': {dots: [massage, workout], selected: true, selectedColor: '#7a9b44'},
                '2025-10-19': {dots: [massage, workout], selected: true, selectedColor: '#7a9b44'},
                '2025-10-28': {dots: [massage, workout], selected: true, selectedColor: '#7a9b44'}
            }}
            onDayPress={day => {
               handlerDate(day)
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        height: 368,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
})
import { ICalendar } from "@/interfaces/ICalendar";
import { useState } from "react";
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
    dateNow: string,
    setDateNow: (date: string) => void
}

export const Calendars = ({setDateNow, dateNow, setData}:Props) => {
    const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
    const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
    const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
    const workout = {key: 'workout', color: 'green'};

    const handlerDate = (day: ICalendar) => {
        setData(day.dateString);
        const [ano, mes, dia] = day.dateString.split("-").map(Number);
        const dataLocal = new Date(Date.UTC(ano, mes - 1, dia, 3, 0, 0));
        const fomatedDate = dataLocal.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                year: 'numeric', 
                month: 'short', 
                day: '2-digit'
            }).split(", ")[0]

        setDateNow(fomatedDate);
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
                '2025-09-17': {dots: [massage, workout], disabled: true}
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
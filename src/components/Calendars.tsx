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

export const Calendars = () => {
    const [selected, setSelected] = useState('');

    const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
    const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
    const workout = {key: 'workout', color: 'green'};

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
            }}
            markedDates={{
                '2025-09-16': {dots: [vacation, massage, workout], selected: true, selectedColor: '#df1b7d'},
                '2025-09-17': {dots: [massage, workout], disabled: true}
            }}
            onDayPress={day => {
                setSelected(day.dateString);
                console.log('selected day', day);
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
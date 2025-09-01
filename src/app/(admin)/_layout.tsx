import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

export default function AdmintLayout() {
    return (
        <Tabs initialRouteName="calendar" screenOptions={{ headerShown: false}}>
            <Tabs.Screen name="newRoom" options={{
                title: 'Sala',
                tabBarIcon: ({ color }) => <MaterialIcons size={28} name="school" color={color} />
            }}/>
            <Tabs.Screen name="calendar" options={{
                title: 'Calendario',
                tabBarIcon: ({ color }) => <MaterialIcons size={28} name="calendar-month" color={color} />
            }}/>
            <Tabs.Screen name="settings" options={{
                title: 'config',
                tabBarIcon: ({ color }) => <MaterialIcons size={28} name="person" color={color} />
            }}/>
        </Tabs>
    )
}
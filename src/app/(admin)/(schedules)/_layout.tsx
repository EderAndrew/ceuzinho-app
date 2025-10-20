import { Stack } from "expo-router";

export default function ScheduleLayout() {
    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="newSchedule"/>
            <Stack.Screen name="editSchedule/[id]" />
        </Stack>
    )
}
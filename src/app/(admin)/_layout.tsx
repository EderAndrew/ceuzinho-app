import { Stack } from "expo-router";

export default function AdminLayout() {
    return (
        <Stack
            initialRouteName="(tabs)"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(schedules)" />
            <Stack.Screen name="(calendar)" />
            <Stack.Screen name="(settings)" />
        </Stack>
    );
}
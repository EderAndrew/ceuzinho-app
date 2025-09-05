import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        (async()=>{
            setTimeout(() => {
                SplashScreen.hideAsync()
            }, 3000);
        })()
    }, [])
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false}}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(admin)"/>
            </Stack>
        </SafeAreaProvider>
    )
}
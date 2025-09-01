import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";


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
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false}}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(admin)"/>
            </Stack>
        </AuthProvider>
    )
}
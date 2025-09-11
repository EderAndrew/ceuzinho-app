import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

export default function AdmintLayout() {    
    return (
        <Tabs initialRouteName="calendar" 
            screenOptions={{
                headerShown: false
            }}
            tabBar={props => <TabBar {...props}/>}
        >
            <Tabs.Screen name="newRoom" options={{ title: "Sala" }}/>
            <Tabs.Screen name="calendar" options={{ title: "Agenda" }}/>
            <Tabs.Screen name="(settings)" options={{ title: "Perfil" }}/>
        </Tabs>
    )
}
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { iconLabels } from "@/constants/icons";

export default function AdminLayout() {
  return (
    <Tabs 
      initialRouteName="calendar"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' } // Hide default tab bar since we use custom
      }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen 
        name="newRoom" 
        options={{ 
          title: iconLabels.newRoom,
          tabBarLabel: iconLabels.newRoom
        }}
      />
      <Tabs.Screen 
        name="calendar" 
        options={{ 
          title: iconLabels.calendar,
          tabBarLabel: iconLabels.calendar
        }}
      />
      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: iconLabels.perfil,
          tabBarLabel: iconLabels.perfil
        }}
      />
    </Tabs>
  );
}
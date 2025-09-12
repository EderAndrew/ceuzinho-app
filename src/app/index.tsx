import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css"
import { Redirect } from "expo-router";


export default function App() {
  return (
    <SafeAreaProvider>
      <Redirect href="/(auth)/login" />
    </SafeAreaProvider>
  )
}

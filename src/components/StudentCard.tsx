import { TouchableOpacity, View, Text } from "react-native"

export const StudentCard = () => {
    return(
        <TouchableOpacity className="border border-slate-400 rounded-lg p-2">
            <View className="flex-row items-center gap-2">
                <View className="h-10 w-10 rounded-full bg-slate-300 border border-slate-400"></View>
                <View>
                    <Text>Nome do Aluno</Text>
                    <Text>Idade: 10 anos</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
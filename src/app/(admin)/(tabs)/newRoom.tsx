import { ClassroomOff } from "@/components/ClassroomOff";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useschedule } from "@/stores/scheduleStore";
import { CompareDate } from "@/hooks/compareDate";

export default function NewRoom(){
    

    //Quando estiver na data da aula, o botão iniciar deve ser habilitado
    //Ao iniciar a aula, o componente muda para o compo nente de aula em andamento e no banco de dados o status da aula deve ser alternado para em andamento...

    return(
        <View className="flex-1 bg-white px-4">
            <ClassroomOff />
        </View>
    )
}
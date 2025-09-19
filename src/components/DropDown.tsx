import { FlatList, TouchableOpacity, View, Text, Modal, TouchableWithoutFeedback, Platform, StyleSheet } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useCallback, useRef, useState } from "react"
import { IDropDownProps, OptionItem } from "@/interfaces/IDropdown"

export const DropDown = ({ data, onChange, placeholder }:IDropDownProps) => {
    const [expanded, setExpanded] = useState(false)
    const [value, setValue] = useState("");
    const [top, setTop] = useState(0)

    const toogleExpandend = useCallback(()=>setExpanded(prev => !prev),[])

    const buttonRef = useRef<View>(null)

    const onSelect = useCallback((item: OptionItem) => {
        onChange(item);
        setValue(item.label);
        setExpanded(false);
    }, [onChange]);

    const handleLayout = useCallback((event:any) => {
        const { y, height } = event.nativeEvent.layout;
        const offset = Platform.OS === 'android' ? -32 : 3;
        setTop(y + height + offset);
    }, []);


    return (
        <View 
            ref={buttonRef}
            onLayout={handleLayout}
        >
            <TouchableOpacity 
                onPress={toogleExpandend}
                activeOpacity={0.8}
                className="border h-14  rounded-md border-slate-400 flex flex-row items-center pl-2 justify-between w-full"
                testID="dropdown-button"
            >
                <Text className="text-xl text-gray-400">{value || placeholder}</Text>
                <MaterialIcons size={28} name={expanded ? "arrow-drop-up" : "arrow-drop-down"} color={"#9c9c9c"} />
            </TouchableOpacity>
            {expanded ?  (
                <Modal visible transparent>
                    <TouchableWithoutFeedback onPress={()=>setExpanded(false)}>
                        <View className="p-4 justify-center items-center flex-1">
                            <View style={[styles.options, { top }]}>
                                <FlatList
                                    keyExtractor={item => item.value}
                                    data={data}
                                    renderItem={({item}) => (
                                        <TouchableOpacity onPress={()=>onSelect(item)} activeOpacity={0.8} className="h-10 justify-center">
                                            <Text className="text-xl">{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View className="h-5" />}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            ): null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    options: {
        position: "absolute",
        backgroundColor: "white",
        width: "100%",
        padding: 10,
        borderRadius: 6,
        maxHeight: 250,
    },
})
import { Picker } from "@react-native-picker/picker"
import { Platform, View, Text } from "react-native"

type Props<T> = {
    selectInfoType: string | null,
    setSelectInfoType: (info: string) => void
    infoObject: T[],
    labelKey?: keyof T,
    valueKey?: keyof T
}

export const PickerInput = <T extends Record<string, any>>({
    selectInfoType,
    setSelectInfoType,
    infoObject,
    labelKey = 'name',
    valueKey = 'name'
}: Props<T>) => {
    return (
        <View className={Platform.select({
            ios: "",
            android: "w-full border-slate-400 border rounded-md"
        })}>
            <View className={Platform.select({
                ios: "",
                android: "rounded-md"
            })}>
                <Picker
                    dropdownIconColor="#1e293b"
                    selectedValue={selectInfoType}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectInfoType(itemValue as string)
                    }
                    mode="dropdown"
                >
                    
                    {infoObject?.map((item) => (
                        <Picker.Item
                            key={item.id}
                            label={String(item[labelKey])}
                            value={String(item[valueKey])}
                            style={{backgroundColor: 'white', color: '#1e293b'}}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    )
}
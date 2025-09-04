import MaterialIcons from "@expo/vector-icons/MaterialIcons"

export const icon = {
  newRoom: (props: any) => <MaterialIcons size={24} name="school" {...props} />,
  calendar: (props: any) => <MaterialIcons size={24} name="calendar-month" {...props} />,
  settings: (props: any) => <MaterialIcons size={24} name="person" {...props} />
}
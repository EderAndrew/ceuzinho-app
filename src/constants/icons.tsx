import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Types
interface IconProps {
  color?: string;
  size?: number;
  [key: string]: any;
}

// Icon configuration
const ICON_CONFIG = {
  newRoom: {
    name: "school" as const,
    size: 24,
    label: "Salas"
  },
  calendar: {
    name: "calendar-month" as const,
    size: 24,
    label: "Agenda"
  },
  perfil: {
    name: "person" as const,
    size: 24,
    label: "Perfil"
  }
} as const;

// Icon component factory
export const icon = {
  newRoom: (props: IconProps) => (
    <MaterialIcons 
      size={props.size || ICON_CONFIG.newRoom.size} 
      name={ICON_CONFIG.newRoom.name} 
      {...props} 
    />
  ),
  calendar: (props: IconProps) => (
    <MaterialIcons 
      size={props.size || ICON_CONFIG.calendar.size} 
      name={ICON_CONFIG.calendar.name} 
      {...props} 
    />
  ),
  perfil: (props: IconProps) => (
    <MaterialIcons 
      size={props.size || ICON_CONFIG.perfil.size} 
      name={ICON_CONFIG.perfil.name} 
      {...props} 
    />
  )
};

// Export configuration for labels
export const iconLabels = {
  newRoom: ICON_CONFIG.newRoom.label,
  calendar: ICON_CONFIG.calendar.label,
  perfil: ICON_CONFIG.perfil.label
} as const;

// Export icon names for type safety
export type IconName = keyof typeof icon;
export type IconConfig = typeof ICON_CONFIG;
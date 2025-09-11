import { IUser } from "@/interfaces/IUser"
import { useUser } from "@/stores/session"

const userRole = {
    ADMIN: "Administrador",
    PROFESSOR: "Professor",
    PARENTE: "Parente",
    PASTOR: "Pastor"
} as const

type UserRoleKey = keyof typeof userRole;

export const useSession = (user: IUser) => {
    const color = user.bgColor ?? "#008c96";
    const photoUrl = user.photoUrl
        ? user.photoUrl.replace("http://localhost:4001", "https://nativcode.com.br")
        : undefined;
    const roleKey = user.role;
    const roleName = roleKey && roleKey in userRole ? userRole[roleKey as UserRoleKey] : "Usuário";

    return { color, photoUrl, roleName }
}
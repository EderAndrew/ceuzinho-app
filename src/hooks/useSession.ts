import { ISession, IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react";

const userRole = {
    ADMIN: "Administrador",
    PROFESSOR: "Professor",
    PARENTE: "Parente",
    PASTOR: "Pastor"
} as const

type UserRoleKey = keyof typeof userRole;

export const useSession = (user: IUser) => {
    //const [session, setSession] = useState<ISession>() 

    const roleKey = user.role;

    const session = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photoUrl,
        photoName: user.photo,
        roleName: roleKey && roleKey in userRole ? userRole[roleKey as UserRoleKey] : "Usuário",
        color: user.bgColor
    }
    //setSession(sess as ISession)

    return { session }
}
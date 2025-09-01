import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextData = {
    isAuthenticated: boolean;
    signIn: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined)

type AuthProviderProps = {
    children: ReactNode
}
export const AuthProvider = ({children}: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const signIn = () => {
        setIsAuthenticated(true)
    }

    const signOut = () => {
        setIsAuthenticated(false)
    }
    return (
        <AuthContext.Provider value={{isAuthenticated, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const usetAuth = (): AuthContextData => {
    const context = useContext(AuthContext)

    if(context === undefined) throw new Error("Usou useAuth antes de definir o AuthContext.")

    return context
}
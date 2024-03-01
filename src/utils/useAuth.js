import React, { createContext, useContext, useState } from "react";
import { login, logout } from "./auth";


const authContext = createContext(null)

export function useAuth() {
    const [auth, setAuth] = useState({loggedIn: false, user: false})

    function saveLogin(user) {
        //const response = await login()
        //if (response.message || !response.user) setAuth(false)
        setAuth({
            user: user,
            loggedIn: true
        })
        console.log(auth)
        setTimeout(saveLogout, 5 * 1000)
    }

    function saveLogout() {
        logout()
        console.log('logged out')
        setAuth(false)
    }

    return {
        auth,
        saveLogin,
        saveLogout
    }
}

export function AuthProvider({children, user, setUser}) {
    const authValue = useAuth()

    function updateUser(details) {
        setUser(details)
        console.log(user)
        setTimeout(logoutUser, 60 * 60 * 1000)
    }

    function logoutUser() {
        logout()
        setUser(null)
        console.log('logged out from app')
        console.log(user)
    }

    return (
        <authContext.Provider value={{user, updateUser, logoutUser}}>{children}</authContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(authContext)
}
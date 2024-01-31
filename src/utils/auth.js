import auth from '../../../../blogAPI/client/src/utils/auth'
import {authHeader, authJson} from './authHeader'
const url = "http://localhost:5000/api/"


 export async function login(body) {
    try {
        const response = await fetch(`${url}auth/login`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(body),
            headers: authJson()
        })
        const data = await response.json()
        if (!response.ok) {
            return data.message
        } else {
            localStorage.setItem('user', JSON.stringify(data.user))
            setTimeout(logout, 15 * 60 * 1000)
            return {message: 'Logged in', user: data.user}
        }
    } catch(err) {
        console.error("Error", err)
        return { err, message: "Could not access database"}
    }
}

export function logout() {
    localStorage.removeItem('user')
    return {message: 'Logged out!'}

}

export async function register(body) {
    try {
        const response = fetch(`${url}/register`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(body),
            headers: authJson()
        })
        const data = await response.json()
        if (!response.ok) {
            return data.message
        } else {
            localStorage.setItem('user', JSON.stringify(data))
            setTimeout(logout, 15 * 60 * 1000)
            return {message: 'Logged in', user: data.user}  
        }
    } catch(err) {
        console.error("Error", err)
        return { err: "Could not access database" }  
    }
}

export function checkUser() {
    const user = localStorage.getItem('user')
    return user ? user : null
}
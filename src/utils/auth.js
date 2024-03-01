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
        console.log(data)
        if (!response.ok) {
            return data.message
        } else {
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', JSON.stringify(data.token))
            setTimeout(logout, 60 * 60 * 1000)
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

//validation returns JSON w/ .message and .errors:[array of errors] on failure
//errors[0] is an obj w/ msg, value, type (ie field), path (ie username), location (body)
export async function register(body) {
    try {
        const response = await fetch(`${url}signup`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(body),
            headers: authJson()
        })
        const data = await response.json()
        if (!response.ok) {
            //data will be JSON w/ errors[] and message
            return data
        } else {
            localStorage.setItem('user', JSON.stringify(data))
            setTimeout(logout, 60 * 60 * 1000)
            return {message: 'Logged in', user: data.user}  
        }
    } catch(err) {
        console.error("Error", err)
        return { err, message: "Could not access database" }  
    }
}

export function checkUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}
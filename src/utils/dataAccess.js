import auth from '../../../../blogAPI/client/src/utils/auth'
import {authHeader, authJson} from './authHeader'

const USERURL = 'http://localhost:5000/api/auth/'
const POSTURL = 'http://localhost:5000/api/posts/'
const INBOXURL = 'http://localhost:5000/api/inbox/'
const GUESTURL = 'http://localhost:5000/api/'
const COMURL = 'http://localhost:5000/api/comments/'


/*     -----user functions-----     */
export async function getUserList() {
    try {
        const response = await fetch(`${USERURL}userlist`, {
            method: "GET",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        if (!response.ok) {
            return data.message
        } else {
            return data
        }
    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}

export async function getUserDetail(id) {
    try {
        const response = await fetch(USERURL + id, {
            method: "GET",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        if (!response.ok) return data.message
        else return data

    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}

export async function getUserHome() {
    try {
        const response = await fetch(`${USERURL}home`, {
            method: "GET",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        if (!response.ok) {
            return data.message
        } else {
            return data
        }

    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}

export async function getAccount() {
    try {
        const response = await fetch(`${USERURL}account`, {
            method: "GET",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        if (!response.ok) return data.message
        else return data

    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}

export async function editAccount(body) {
    try {
        const response = await fetch(`${USERURL}account`, {
            method: "PUT",
            mode: 'cors',
            body: JSON.stringify(body),
            headers: authJson()
        })
        const data = await response.json()
        return data


    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}

// need to add google auth, icon upload

//friends
export async function getFriendsList() {
    try {
        const response = await fetch(`${USERURL}friends`, {
            method: "GET",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        if (!response.ok) {
            return data.message
        } else {
            return data
        }

    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }  
}

export async function addFriend(id) {
    try {
        const response = await fetch(`${USERURL}add/${id}`, {
            method: "PUT",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        return data.message

    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}

export async function delFriend(id) {
    try {
        const response = await fetch(`${USERURL}delete/${id}`, {
            method: "DELETE",
            mode: 'cors',
            headers: authHeader()
        })
        const data = await response.json()
        return data.message

    } catch(err) {
        console.error("Error", err);
        return { err: "Could not access database" };  
    }
}


/*     -----Post functions-----     */

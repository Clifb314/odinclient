export function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user && user.token) {
        return {  'x-access-token': user.token, Authorization: `Bearer ${user.token}` }
    } else return {}
}

export function authJson() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user && user.token) {
        return {
            'x-access-token': user.token, 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
    } else return {'Content-Type': 'application/json'}
}
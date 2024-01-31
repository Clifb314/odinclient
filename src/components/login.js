import React, { useState } from 'react'
import login from '../utils/auth'

export default function Login() {
    const template = {
        username: '',
        password: ''
    }
    const [creds, setCreds] = useState(template)


    function handleChange(e) {
        const { name, value } = e.target
        setCreds({
            ...creds,
            [name]: value    
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const fetchUser = await login({username: creds.username, password: creds.password})
        if (!fetchUser.user || fetchUser.err) return fetchUser.message //error handling
        else return fetchUser.user //set user higher up
    }


    return (
        <form className='loginForm' onSubmit={handleSubmit}>
            <input name='username' id='username' value={creds.username} onChange={handleChange} />
            <input name='password' type='password' id='password' value={creds.password} onChange={handleChange} />
        </form>
    )

}
import React, { useState } from 'react'
import register from '../utils/auth'
import googleAuth from '../utils/dataAccess'

export default function Register() {
    const template = {
        username: '',
        fName: '',
        lName: '',
        email: '',
        password: '',
        checkPW: '',
        bday: '',
        googleAcct: null,
    }
    const [ userInfo, setUserInfo ] = useState(template)


    function handleChange(e) {
        const {name, value} = e.target
        setUserInfo({...userInfo, [name]: value})
    }

    async function getGoogleInfo(e) {
        const googleInfo = await googleAuth()
        //pretty sure this needs to redirect to google some other way
        if (googleInfo.err) return googleAuth.message //error handling
        else setUserInfo({...userInfo, googleAcct: googleInfo})
    }

    async function handleSubmit(e) {
        const signup = await register(userInfo)
        if (signup.err) return signup.err //error handling
        else return signup.user //set user higher up
    }


    return (
        <div className='register'>
            <form className='registerForm' onSubmit={handleSubmit}>
                <input name='username' id='username' value={userInfo.username} />
                <input name='fName' id='fName' value={userInfo.fName} />
                <input name='lName' id='lName' value={userInfo.lName} />
                <input name='email' id='email' value={userInfo.email} />
                <input name='bday' id='bday' type='date' value={username.bday} />
                <input name='password' id='password' type='password' value={userInfo.password} />
                <input name='checkPW' id='checkPW' type='password' value={userInfo.checkPW} />
                <button type='submit'>Submit</button>
                <button type='button' onClick={getGoogleInfo}>Link with Google!</button>
            </form>
        </div>
    )





}
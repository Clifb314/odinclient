import React, { useState } from 'react'
import {register} from '../utils/auth'
import { editIcon, googleAuth } from '../utils/dataAccess'
import MsgBox from './slideInMsg'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../utils/useAuth'

export default function Register() {

    const {user, updateUser} = useAuthContext()

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
    const [valErrs, setValErrs] = useState([])
    const [ userInfo, setUserInfo ] = useState(template)
    const [displayMsg, setDisplayMsg] = useState(null)
    const navigate = useNavigate()

    function closeSlideIn() {
        setDisplayMsg(null)
    }

    function openSlideIn(type, msg) {
        setDisplayMsg({type, msg,})
        setTimeout(closeSlideIn, 5 * 1000)
    }

    function handleChange(e) {
        const {name, value} = e.target
        setUserInfo({...userInfo, [name]: value})
    }

    async function getGoogleInfo(e) {
        const googleInfo = await googleAuth()
        //pretty sure this needs to redirect to google some other way
        if (googleInfo.err) openSlideIn('error', googleInfo.err) //error handling
        else {
            setUserInfo({...userInfo, googleAcct: googleInfo})
            openSlideIn('success', 'Google account linked!')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setValErrs([])
        const signup = await register(userInfo)
        console.log(signup)
        if (signup.err) {
            //server error
            openSlideIn('error', signup.err)
            return
        }
        if (!signup.user || signup.errors) {
            //validation errors
            setValErrs(signup.errors)
            return
        }
        if (signup.user.icon) {
            //create icon from same method to update icon
            const iconForm = new FormData()
            iconForm.append('icon', e.icon)
            const response = await editIcon(iconForm)
            if (response.err) openSlideIn('error', response.err) //error handling
            
        }
        else {
            updateUser(signup.user)
        }
        //set user higher up?
    }

    const alerts = displayMsg 
    ? <MsgBox type={displayMsg.type} message={displayMsg.msg} close={closeSlideIn} />
    : null

    const displayErrs = valErrs?.length > 0 
    ?  <div className='validationErrors'>
            {valErrs.map(err => {
                    return <p>{err.path} : {err.msg}</p>
                    })}
        </div>
    :  null
    return (
        <div className='register'>
            <div className='registerText'>
                <h1>CliffBook</h1>
                <p>Register and join in on the discussion!</p>
            </div>
            <form className='registerForm' onSubmit={handleSubmit}>
                <label htmlFor='icon'>Upload your user icon</label>
                <input name='icon' id='icon' type='file' accept='image/*'/>
                <label htmlFor='username'>Username: </label>
                <input name='username' id='username' value={userInfo.username} onChange={handleChange} />
                <label htmlFor='fName'>First Name: </label>
                <input name='fName' id='fName' value={userInfo.fName} onChange={handleChange} />
                <label htmlFor='lName'>Last Name: </label>
                <input name='lName' id='lName' value={userInfo.lName} onChange={handleChange} />
                <label htmlFor='email'>Email: </label>
                <input name='email' id='email' value={userInfo.email} onChange={handleChange} />
                <label htmlFor='bday'>Birthday: </label>
                <input name='bday' id='bday' type='date' value={userInfo.bday} onChange={handleChange} />
                <label htmlFor='password'>Password: </label>
                <input name='password' id='password' type='password' value={userInfo.password} onChange={handleChange} />
                <label htmlFor='checkPW'>Re-enter Password: </label>
                <input name='checkPW' id='checkPW' type='password' value={userInfo.checkPW} onChange={handleChange} />
                <button className='submitBtn' type='submit'>Submit</button>
                <button className='gBtn' type='button' onClick={getGoogleInfo}>G!</button>
            </form>
            {displayErrs}
            {alerts}
        </div>
    )





}
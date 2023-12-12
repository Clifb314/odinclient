import React, { useEffect, useState } from 'react'
import * as dataAccess from '../utils/dataAccess'

export default function Account({ user }) {
    const [myPage, setMyPage] = useState(null)
    const [editting, setEditting] = useState(false)

    const getUser = async () => {
        //if this needs to be async
        return await dataAccess.getAccount()
    }

    useEffect(() => {
        const fetchUser = dataAccess.getAccount()
        if (fetchUser.message) setMyPage(null)
        else {
            setMyPage({...fetchUser, password: '', checkPW: ''})
            //set icon from blob?
        } 

        return () => setMyPage(null)
    }, [])

    function toggle() {
        editting ? setEditting(false) : setEditting(true)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const body = JSON.parse(e.target)
        const submit = dataAccess.editAccount(body)
        if (submit.err) return submit.err //handle error
        else return submit.message //display submit.message

    }


    const display = myPage ? 
    <form id='accountForm' onSubmit={handleSubmit}>
        <input id='username' name='username' value={myPage.username} disabled={!editting} />
        <input id='email' name='email' value={myPage.userDetails.email} disabled={!editting} />
        <input id='name' name='name' value={myPage.userDetails.fullName} disabled={!editting} />
        <input id='bday' name='bday' value={myPage.userDetails.birthdate} disabled={!editting} />
        <input id='password' name='password' type='password' value={myPage.password} hidden={!editting} />
        <input id='checkPW' name='checkPW' type='password' value={myPage.checkPW} hidden={!editting} />
        <p>Friends: {myPage.friends.length}</p>
        <p>Posts: {myPage.posts.length}</p>
        <button type='button' hidden={editting} onClick={toggle}>Edit?</button>
        <button type='submit' hidden={!editting}>Submit</button>
    </form>
    : <p>Must be logged in to access this page</p>




    return (
        <div className='accountPage'>{display}</div>
    )
}
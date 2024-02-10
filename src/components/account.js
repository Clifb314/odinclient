import React, { useEffect, useState } from 'react'
import {getAccount, editAccount} from '../utils/dataAccess'
import FriendsList from './FriendsList'
import PostCard from './postCard'

export default function Account({ user }) {
    const [myPage, setMyPage] = useState(null)
    const [editting, setEditting] = useState(false)


    //could get from token instead
    const getUser = async () => {
        //if this needs to be async
        return await getAccount()
    }

    useEffect(() => {
        const fetchUser = getUser()
        if (fetchUser.message) setMyPage(null)
        //error handling here
        else {
            setMyPage({...fetchUser, password: '', checkPW: '', oldPW: '', fname: '', lname: ''})
            //set icon from blob?
        } 

        return () => setMyPage(null)
    }, [])

    function toggle() {
        editting ? setEditting(false) : setEditting(true)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const {lname, fname} = e.target.name
        //const body = JSON.parse(e.target)
        const body = {
            ...myPage,
            fullName: fname + ' ' + lname,
        }
        const submit = editAccount(body)
        if (submit.err) return submit.err //handle error
        else return submit.message //display submit.message

    }

    function handleChange(e) {
        const { value, name } = e.target
        setMyPage({...myPage, [name]: value})
    }

    const myPosts = myPage.posts?.length > 0
    ? <ul className='feedList'>{myPage.posts.map(post => {
        return <li><PostCard post={post} /></li>
    })}</ul>
    : <p>Nothing's here... Try posting something!</p>

    const display = myPage ? 
    <form id='accountForm' onSubmit={handleSubmit}>
        <input id='username' name='username' value={myPage.username} disabled={!editting} onChange={handleChange} />
        <input id='email' name='email' value={myPage.userDetails.email} disabled={!editting} onChange={handleChange} />
        <input id='fname' name='name' value={myPage.userDetails.fullName} disabled={!editting} onChange={handleChange} />
        <input id='lname' name='name' value={myPage.userDetails.fullName} disabled={!editting} onChange={handleChange} />
        <input id='bday' name='bday' value={myPage.userDetails.birthdate} disabled={!editting} onChange={handleChange} />
        <input id='password' name='password' type='password' value={myPage.password} hidden={!editting} onChange={handleChange} />
        <input id='checkPW' name='checkPW' type='password' value={myPage.checkPW} hidden={!editting} onChange={handleChange} />
        <input id='oldPW' name='oldPW' type='password' value={myPage.oldPW} hidden={!editting} onChange={handleChange} />
        <p>Posts: {myPage.posts.length}</p>
        <button type='button' hidden={editting} onClick={toggle}>Edit?</button>
        <button type='submit' hidden={!editting}>Submit</button>
    </form>
    : <p>Must be logged in to access this page</p>




    return (
        <div className='userDetails'>
            <div className='accountPage'>{display}</div>
            <div>
                <FriendsList friends={myPage.friends} />
            </div>
            <div className='feed'>
                {myPosts}
            </div>
        </div>
    )
}
import React, { useEffect, useState } from 'react'
import postList from '../utils/dataAccess'
import PostCard from './postCard'
import { checkUser } from '../utils/auth'

export default function feed({sorting, populateReply}) {
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState(null)


    async function getPosts() {
        return await postList(sorting)   
    }

    async function getUser() {
        const check = await checkUser()
        setUser(check)
    }

    useEffect(() => {
        const list = getPosts()
        setPosts(list)
        getUser()

        return () => setPosts([])
    }, [])


    const display = posts.length > 0 
    ? <ul className='feedList'>
        {posts.map(post => {
            return <li key={post._id}><PostCard post={post} user={user} /></li>
        })}
    </ul> 
    : <p>Feed is empty..</p>


    return (
        <div className='feed'>{display}</div>
    )



}
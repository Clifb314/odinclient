import React, { useEffect, useState } from 'react'
import postList from '../utils/dataAccess'
import PostCard from './postCard'

export default function feed({sorting}) {
    const [posts, setPosts] = useState([])


    async function getPosts() {
        return await postList(sorting)
        
    }

    useEffect(() => {
        const list = getPosts()
        setPosts(list)

        return () => setPosts([])
    }, [])


    const display = posts.length > 0 ?
    posts.map(post => {
        return <PostCard post={post} />
    }) :
    <p>Feed is empty..</p>


    return (
        <div className='feed'>{display}</div>
    )



}
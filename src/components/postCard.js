import React, { useState } from 'react'
import { likePost } from '../utils/dataAccess'


export default function PostCard({post}) {
    const [displayCom, setDisplayCom] = useState(false)

    function toggle() {
        displayCom ? setDisplayCom(false) : setDisplayCom(true)
    }

    async function handleVote(direction) {
        const response = await likePost(direction)
        if (response.err) return response.message //error handling
        else return
    }

    return (
        <div className='postCard'>
            <p>{post.author.username}</p>
            <p>{post.title}</p>
            <p>{post.content}</p>
            <p>{post.date}</p>
            <p>{post.likes.length}</p>
            {displayCom ? 
                <p onClick={toggle}>comments component here</p>
                :
                <p onClick={toggle}>Show {post.comments.length} comments...</p>
            }
            <div className='interactBtn'>
                <button type='button' onClick={() => handleVote('up')}>Like</button>
                <button type='button' onClick={() => handleVote('down')}>Dislike</button>
                <button type='button'>Comment</button>
            </div>
        </div>
    )
}
import React, { useRef, useState } from 'react'
import { likePost } from '../utils/dataAccess'
import CommentCard from './commentCard'


export default function PostCard({post, populateReply}) {
    const [displayCom, setDisplayCom] = useState(false)

    //ref to the list of comment nodes
    const replyRef = useRef(null)

    function toggle() {
        displayCom ? setDisplayCom(false) : setDisplayCom(true)
    }

    async function handleVote(direction) {
        const response = await likePost(direction)
        if (response.err) return response.message //error handling
        else return
    }

    function getReplyToComment(id) {
        //to preview the comment on mouseover
        const target = post.comments.filter(comment => comment._id === id)
        const output = target.shift()
        return output ? output : null
    }

    function handleScroll(id) {
        //scroll to comment on click
        const listNode = replyRef.current
        const replyArr = listNode.querySelectorAll('li').filter(node => node.key === id)
        const replyNode = replyArr.shift()
        replyNode.scrollIntoView({
            behavior: 'smooth',
        })

    }

    function openComment(reply = null) {
        populateReply('comment', reply, post._id)
    }

    const checkLen = post.comments.length > 0 
        ? <p onClick={toggle}>Show {post.comments.length} comments...</p>
        : <p>Be the first to comment!</p>


    const display = post.comments.length > 0 
        ? <ul ref={replyRef}>
            {post.comments.map(comment => {
                return <li key={comment._id}>
                    <div>
                        <CommentCard comment={comment} findReply={getReplyToComment} scroll={handleScroll} />
                        <p onClick={() => openComment(comment._id)}>Reply</p>
                    </div>
                    </li>
                })
            }
            </ul>
        : null

    return (
        <div className='postCard'>
            <p>{post.author.username}</p>
            <p>{post.title}</p>
            <p>{post.content}</p>
            <p>{post.date}</p>
            <p>{post.likes.length}</p>
            <div className='interactBtn'>
                <button type='button' onClick={() => handleVote('up')}>Like</button>
                <button type='button' onClick={() => handleVote('down')}>Dislike</button>
                <button type='button' onClick={openComment}>Comment</button>
            </div>
            {displayCom 
                ? 
                <div className='commentsSection'>
                    {display}
                    <p onClick={toggle}>collapse</p>
                    </div>
                :
                {checkLen}
            }
        </div>
    )
}
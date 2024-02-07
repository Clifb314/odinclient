import React, { useRef, useState } from 'react'
import { likePost, delPost } from '../utils/dataAccess'
import CommentCard from './commentCard'


export default function PostCard({post, populateReply, user}) {
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

    async function handleDelete(id) {
        const response = await delPost(id)
        if (response.err) return response.err //error handling
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

    function openComment(reply = null, editing = null) {
        populateReply('comment', reply, post._id, editing)
    }

    function openEdit() {

        populateReply('post', null, post._id, post)
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
                        <button type='button' onClick={() => openComment(null, comment)}>Edit</button>
                    </div>
                    </li>
                })
            }
            </ul>
        : null


    const buttons = user._id === post.author._id
    ?  <div className='interactBtn'>
        <button type='button' onClick={openEdit}>Edit</button>
        <button type='button' onClick={() => handleDelete(post._id)}>Delete</button>
    </div>
    :  <div className='interactBtn'>
        <button type='button' onClick={() => handleVote('up')}>Like</button>
        <button type='button' onClick={() => handleVote('down')}>Dislike</button>
        <button type='button' onClick={openComment}>Comment</button>
    </div>
    return (
        <div className='postCard'>
            <p>{post.author.username}</p>
            <p>{post.title}</p>
            <p>{post.content}</p>
            <p>{post.date}</p>
            <p>{post.likes.length}</p>
            {buttons}
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
import React, { useState } from "react";
import { createComment, createPost } from "../utils/dataAccess";



export default function PopupForm({type, toggleOpen, replying, postid}) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    async function handleSubmit() {
        let post = {
            content,
            date: new Date(),
        }
        if (type === 'post') {
            post.title = title
        } else if (replying && type === 'ccomment') {
            post.replyTo = replying
        } else {
            
        }
        const submitPost = type === 'post' ? createPost : createComment
        const response = submitPost(post, postid)
        if (response.err) return response.err //error handling
        else toggleOpen()
    }



    return (
        <div className='popup' onSubmit={handleSubmit}>
            <form id="popup Form">
                <input type="text" name='title' id="title" value={title} onChange={setTitle} />
                <textarea value={content} id="content" name="content" onChange={setContent} />
                <button form="popupForm" type="submit" className="send">Send</button> 
            </form>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import { createComment, createPost, editPost, editComment } from "../utils/dataAccess";



export default function PopupForm({type, toggleOpen, replying, postid, editing}) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    async function handleSubmit() {
        let post = {
            content,
        }
        if (type === 'post') {
            post.title = title
        } else if (type === 'comment') {
            post.replyTo = replying
        } 

        const submitPost = type === 'post' ? createPost : createComment
        const response = submitPost(post, postid)
        if (response.err) return response.err //error handling
        else toggleOpen()
    }

    async function handleEdit() {
        let post = {
            content,
        }
        if (type === 'post') {
            post.title = title
        } else if (type === 'comment') {
            post.replyTo = replying
        } 

        const submitEdit = type === 'post' ? editPost : editComment
        const response = submitEdit(post, editing._id, postid)
        if (response.err) return response.err //error handling
        else toggleOpen()
    } 
    

    useEffect(() => {
        if (editing) {
            setContent(editing.content)
            editing.title ? setTitle(editing.title) : null
        }
        return () => {
            setContent('')
            setTitle('')
        }
    }, [])



    return (
        <div className='popup'>
            <form id="popup Form">
                <input hidden={type === 'post' ? false : true} type="text" name='title' id="title" value={title} onChange={setTitle} />
                <textarea value={content} id="content" name="content" onChange={setContent} />
                <button hidden={editing ? true : false} type="button" className="send" onClick={handleSubmit}>Send</button> 
                <button hidden={editing ? false : true} type="button" className="edit" onClick={handleEdit}>Edit</button>
            </form>
        </div>
    )
}
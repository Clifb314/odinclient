import React, { useEffect, useState } from "react";
import { likeComment } from "../utils/dataAccess";
import PopupReply from "./popupReply";

export default function CommentCard({comment, findReply, scroll}) {
    const [hovering, setHovering] = useState(false)

    async function handleVote(direction) {
        const response = await likeComment(comment._id, direction)
        if (response.err) return response.message //error handling
        else return
    }


    //tiktok style replying to comments (no nesting)
    const replyLine = comment.replyTo 
    ? <div>
        <p onMouseOver={() => setHovering(true)} onMouseOut={() => setHovering(false)}>
            replying to <span onClick={() => scroll(comment.replyTo._id)}>{comment.replyTo.author.username}</span>
        </p>
        <PopupReply hovering={hovering} reply={findReply(comment.replyTo._id)} />
    </div>
    : <p></p>


    return (
        <div className="commentCard">
            {replyLine}
            <p>{comment.author.username}</p>
            <p>{comment.content}</p>
            <p>{comment.date}</p>
            <p>{comment.likes.length}</p>
            <div className="interactBtn">
                <button type="button" onClick={() => handleVote('up')}>Like</button>
                <button type="button" onClick={() => handleVote('down')}>Dislike</button>
            </div>
        </div>
    )

}
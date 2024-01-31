import React, { useEffect, useState } from "react";
import { likeComment } from "../utils/dataAccess";

export default function CommentCard({comment}) {

    async function handleVote(direction) {
        const response = await likeComment(comment._id, direction)
        if (response.err) return response.message //error handling
        else return
    }

    //tiktok style replying to comments (no nesting)


    return (
        <div className="commentCard">
            <p>{comment.author.username}</p>
            <p>{comment.content}</p>
            <p>{comment.date}</p>
            <p>{comment.likes.length}</p>
            <div className="interactBtn">
                <button type="button" onClick={() => handleVote('up')}>Like</button>
                <button type="button" onClick={() => handleVote('down')}>Dislike</button>
                <button type="button">Reply</button>
            </div>
        </div>
    )

}
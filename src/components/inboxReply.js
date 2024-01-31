import React, { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuidv4'
import { sendInbox, inboxDetail } from "../utils/dataAccess";



export default function InboxReply({openMsg}) {
    const [reply, setReply] = useState('')
    const [chain, setChain] = useState([])

    async function getChain() {
        if (!openMsg) return
        const response = await inboxDetail(openMsg._id)
        if (response.err) return response.err //error handling
        else setChain(response)
    }

    useEffect(() => {
        getChain()

        return () => setChain([])
    }, [openMsg])

    const displayChain = chain && chain.length > 0 ?
    chain.map(msg => {
        return (
            <div key={uuidv4()} className="inboxItem">
                <p>{msg.from.username}</p>
                <p>{msg.content}</p>
                <p>{msg.date}</p>
            </div>
        )
    }) : 
    <div className="empty"></div>

    const displayTitle = chain[0].title ? <p>{chain[0].title}</p> : null


    function handleChange(e) {
        setReply(e.target.value)
    }

    async function handleSubmit() {
        const message = {
            to: openMsg.from.username,
            from: null, //get user_id from somewhere
            content: reply,
            date: new Date(),
            head: openMsg._id, //get from prop
            title: '', //will only have title for first msg (?)
            seen: false,
        }
        const response = await sendInbox(message)
        if (response.err) return response.message //error handling
        else return //add message to chain
    }

    return (
        <div className="inboxReply">
            {/* message chain here */}
            <div className="fullChain">
                {displayTitle}
                {displayChain}
            </div>
            <form id="replyForm" onSubmit={handleSubmit}>
                <input type="text" name="content" placeholder="Reply here.." value={reply} onChange={handleChange} />
                <button form="replyForm" type="submit">Send</button>
            </form>
        </div>
    )
}
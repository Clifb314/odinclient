import React, { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'
import { sendInbox, inboxDetail } from "../utils/dataAccess";
import { useAuthContext } from "../utils/useAuth";



export default function InboxReply({openMsg}) {
    const [reply, setReply] = useState('')
    const [chain, setChain] = useState([])
    const [title, setTitle] = useState('')
    const [checkNew, setCheckNew] = useState(false)

    const {user} = useAuthContext()

    async function getChain() {
        if (!openMsg) return

        else if (openMsg.new) {
            const newMsg = {
                _id: 1,
                to: openMsg.to, //expecting an obj w/ username and _id
                from: user._id,
                content: 'Type your first message below!',
                date: null,
            }
            setChain([newMsg])
            return
        }


        const response = await inboxDetail(openMsg._id)
        if (response.err) return response.err //error handling
         setChain(response)
    }

    useEffect(() => {
        getChain()

        return () => setChain([])
    }, [openMsg])

    const displayChain = chain && chain.length > 0 ?
    chain.map(msg => {
        const side = msg.to === user._id ? 'left' : 'right'
        return (
            <div key={msg._id} className={`inboxItem ${side}`}>
                {/* icon */}
                <p>{msg.from.username}</p>
                <p>{msg.to.username}</p>
                <p>{msg.content}</p>
                <p className="timestamp">{new Date(msg.date).toLocaleString()}</p>
            </div>
        )
    }) : 
    <div className="empty"></div>

    const displayTitle = chain[0]?.title ? <h2>{chain[0].title}</h2> : null


    function handleChange(e) {
        setReply(e.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const message = {
            to: openMsg.to,
            from: user._id, //get user_id from somewhere
            content: reply,
            date: new Date(),
            head: openMsg._id ? openMsg._id : null, //get from prop
            title: openMsg?.new ? title : '', //will only have title for first msg (?)
            seen: false,
        }
        const response = await sendInbox(message)
        console.log(response)
        if (response.err) return response.message //error handling
        else {
            setChain([...chain, message])
            setReply('')
            setTitle('')
        }
    }

    return (
        <div className="inboxReply">
            {/* message chain here */}
            <div className="convoChain">
                {/*<h1>{openMsg?.to.username === user.username ? openMsg.from.username : openMsg.to.username}</h1>*/}
                {displayTitle}
                {displayChain}
            </div>
            <form id="replyForm" onSubmit={handleSubmit}>
                <input type={openMsg?.new ? 'text' : 'hidden'} 
                 name="content"
                 placeholder="Title (optional)" 
                 value={title} 
                 onChange={(e) => setTitle(e.target.value)} 
                />
                <input type="text" name="content" placeholder="Reply here.."
                 value={reply} 
                 onChange={handleChange} />
                <button className="submitBtn" form="replyForm" type="submit">Send</button>
            </form>
        </div>
    )
}
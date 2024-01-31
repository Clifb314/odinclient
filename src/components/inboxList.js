import React, { useEffect, useState } from "react";
import { getInboxList } from "../utils/dataAccess";
import {v4 as uuidv4} from 'uuidv4'

export default function InboxList({handleClickedMsg}) {
    const [list, setList] = useState([])

    //might export this to main so header can show unread count
    async function getList() {
        const response = await getInboxList()
        if (response.err) return response.msg //error handling
        else setList(response)
    }
    
    useEffect(() => {
        getList()

        return () => setList([])
    })

    const display = list.length > 0 ?
    list.map(msg => {
        return (
            <div onClick={() => handleClickedMsg(msg)} key={uuidv4()} id={msg._id} className={`inboxList ${msg.seen}`}>
                {/* icon needed */}
                <p>{msg.from.username}</p>
                <p>{msg.title}</p>
                <p>{msg.content.slice(0, 20)}</p>
                <p>{msg.date}</p>
            </div>
        )
    }) :
    <p>Inbox is empty!</p>    

    return (
        <div>{display}</div>
    )

}
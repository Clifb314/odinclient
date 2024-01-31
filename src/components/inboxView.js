import React, { useState } from "react";
import { readInbox } from "../utils/dataAccess";
import InboxReply from "./inboxReply";
import InboxList from "./inboxList";


export default function InboxView() {
    const [openMsg, setOpenMsg] = useState(null)


    async function handleClickedMsg(msg) {
        await readInbox(msg._id)
        setOpenMsg(msg)
    }




    return (
        <div>
            <div className="sidebar">
                <h2>Conversations</h2>
                <InboxList handleClickedMsg={handleClickedMsg} />
                </div>
            <div className="mainDisp"><InboxReply openMsg={openMsg} /></div>
        </div>
    )
}
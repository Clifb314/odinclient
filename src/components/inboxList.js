import React, { useEffect, useState } from "react";
import { getInboxList } from "../utils/dataAccess";
import { v4 as uuidv4 } from "uuid";

export default function InboxList({ handleClickedMsg }) {
  const [list, setList] = useState([]);

  //might export this to main so header can show unread count
  async function getList() {
    const response = await getInboxList();
    console.log(response);
    if (response.err) return setList([]); //error handling
    else setList(response);
  }

  useEffect(() => {
    getList();

    return () => setList([]);
  }, []);

  const display =
    list.length > 0 ? (
      list.map((msg) => {
        return (
          <div
            onClick={() => handleClickedMsg(msg)}
            key={uuidv4()}
            id={msg._id}
            className={`inboxList ${msg.seen ? "read" : "unread"}`}
          >
            {/* icon needed */}
            <p className="username">{msg.from.username}</p>
            <p>{msg.title}</p>
            <p>{msg.content.slice(0, 20)}...</p>
            <p className="timestamp">{new Date(msg.date).toLocaleString()}</p>
          </div>
        );
      })
    ) : (
      <p>Inbox is empty!</p>
    );

  return <div className="convoList">{display}</div>;
}

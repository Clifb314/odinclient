import React, { useEffect, useState } from "react";
import { deleteInbox, getInboxList } from "../utils/dataAccess";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "../utils/useAuth";
import IconDisplay from "../utils/iconHelper";

export default function InboxList({ handleClickedMsg }) {
  const [list, setList] = useState([]);


  const {user} = useAuthContext()

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

  async function handleDeleteMsg(id) {
    const response = await deleteInbox(id)
    if (response.err) console.log(response.err)
    else {
      console.log(response)
      const updatedList = list.filter(msg => msg._id !== id)
      setList(updatedList)
    }
  }

  const display =
    list.length > 0 ? (
      list.map((msg) => {
        return (
          <div
            onClick={() => handleClickedMsg(msg)}
            key={msg._id}
            className={`inboxList ${msg.seen ? "read" : "unread"}`}
          >
            {/* icon needed */}
            <button onClick={() => handleDeleteMsg(msg._id)} className="delete">X</button>
            <IconDisplay icon={msg.from.icon} userID={msg.from._id} username={msg.from.username} />
            <p className="username">{msg.from.username === user.username ? msg.to.username : msg.from.username}</p>
            <p className="title">{msg.title}</p>
            <p className="content">{msg.from.username} : {msg.content.slice(0, 10)}{msg.content.length > 10 ? '...' : ''}</p>
            <p className="timestamp">{new Date(msg.date).toLocaleString()}</p>
          </div>
        );
      })
    ) : (
      <p>Inbox is empty!</p>
    );

  return <div className="convoList">{display}</div>;
}

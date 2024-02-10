import React, { useEffect, useState } from "react";
import { readInbox, findOrCreate } from "../utils/dataAccess";
import InboxReply from "./inboxReply";
import InboxList from "./inboxList";
import { checkUser } from "../utils/auth";


export default function InboxView({friendid}) {
    const [openMsg, setOpenMsg] = useState(null)
    const [showTo, setShowTo] = useState(false)
    const [friendsList, setFriendsList] = useState([])
    const [options, setOptions] = useState([])
    const [searchString, setSearchString] = useState('')
    const [dropDownView, setDropDownView] = useState(false)

    function getFriends() {
        const friends = checkUser().friends
        setFriendsList(friends)
        let shortList = []
        for (let i = 0; i < 5 && i < friends.length - 1; i++) {
            shortList.push(friends[i])
        }
        setOptions(shortList)
    }

    async function handleClickedMsg(msg) {
        await readInbox(msg._id)
        setOpenMsg(msg)
    }

    async function findFromRedirect(id) {
        const msg = await findOrCreate(id)
        if (msg.err) return msg.err //error handling
        else return setOpenMsg(msg)
    }

    function filterOptions(e) {
        const {value} = e.target
        setSearchString(value)
        const len = value.length
        const regexStr = new RegExp(`^[\w]*${value}[\w]*$`)
        const filteredArr = friendsList.filter(friend => {
            return regexStr.test(friend.username)
        })
        if (filteredArr.length > 0) {
            setOptions(filteredArr)
        } else {
            setOptions(['User not found'])
        }
    }

    async function startChain() {
        //showTo ? setShowTo(false) : setShowTo(true)
        if (showTo) {
            setShowTo(false)
            setSearchString('')
            let shortList = []
            for (let i = 0; i < 5 && i < friends.length - 1; i++) {
                shortList.push(friends[i])
            }
            setOptions(shortList)
        } else {
            setShowTo(true)
        }
    }

    const dropDown = dropDownView 
      ? <div className="dropDown">
        <h3>Friends</h3>
        {options.map(option => {
            return <p key={option._id}
             onClick={() => findFromRedirect(option._id)}>
                {option.username}
            </p>
        })}
      </div>
      : null

    useEffect(() => {
        //redirect is a friendid to whom you want to message
        //let's check for messages to friendid and return the most recent message chain
        //if none, create a new one
        if (friendid) {
            findFromRedirect(friendid)
        }
        getFriends()
    }, [])





    return (
        <div>
            <div className="sidebar">
                <h2>Conversations</h2>

                <button type="button" className={showTo ? 'closeMsg' : 'newMsg'}
                 onClick={startChain}>
                    {showTo ? '+' : 'X'}
                </button>

                <input type="text" hidden={!showTo} name="to" id="to" 
                  value={searchString}
                  onChange={filterOptions}
                  onFocus={() => setDropDownView(true)}
                  onBlur={() => setDropDownView(false)} />
                {dropDown}
                <InboxList handleClickedMsg={handleClickedMsg} />
                </div>
            <div className="mainDisp"><InboxReply openMsg={openMsg} /></div>
        </div>
    )
}
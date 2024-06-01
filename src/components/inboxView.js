import React, { useEffect, useState } from "react";
import { readInbox, findOrCreate } from "../utils/dataAccess";
import InboxReply from "./inboxReply";
import InboxList from "./inboxList";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../utils/useAuth";


export default function InboxView() {
    const [openMsg, setOpenMsg] = useState(null)
    const [showTo, setShowTo] = useState(false)
    const [friendsList, setFriendsList] = useState([])
    const [options, setOptions] = useState([])
    const [searchString, setSearchString] = useState('')
    const [dropDownView, setDropDownView] = useState(false)
    const {user} = useAuthContext()
    
    
    const [searchParams, setSearchParams] = useSearchParams()
    
    
    
    
    
    const navi = useNavigate()
    //const friend = useParams()


    function getFriends() {
        if (user.friends) {
            setFriendsList(user.friends)
            let shortList = []
            for (let i = 0; i < 5 && i < user.friends.length - 1; i++) {
                shortList.push(user.friends[i])
            }
            setOptions(shortList)    
        }
    }

    async function handleClickedMsg(msg) {
        await readInbox(msg._id)
        setOpenMsg(msg)
    }

    async function findFromRedirect(friendID, username) {
        if (friendID === null) return
        const msg = await findOrCreate(friendID)
        console.log(msg)
        if (msg.err) return msg.err //error handling
        else if (msg.new) {
            msg.to = {
                _id: friendID,
                username,
            }
            msg.from = user
            setOpenMsg(msg)
        }
        else setOpenMsg(msg)
    }

    function filterOptions(e) {
        const {value} = e.target
        setSearchString(value)
        const regStr = `[\w]*${value}[\w]*`
        const regexStr = new RegExp(regStr, 'i')
        const filteredArr = friendsList.filter(friend => {
            return regexStr.test(friend.username)
        })
        if (filteredArr.length > 0) {
            setOptions(filteredArr)
        } else {
            setOptions([{
                _id: null,
                username: 'User not found'
            }])
        }
    }

    async function startChain() {
        //showTo ? setShowTo(false) : setShowTo(true)
        if (!showTo) {
            setShowTo(true)
            setSearchString('')
            let shortList = []
            for (let i = 0; i < 5 && i < friendsList.length; i++) {
                shortList.push(friendsList[i])
            }
            console.log(shortList)
            setOptions(shortList)
        } else {
            setShowTo(false)
            setSearchString('')
        }
    }

    const dropDown = dropDownView 
      ? <div className="dropDown">
        <h5>Friends</h5>
        {options.map(option => {
            return <p key={option._id}
             onClick={() => findFromRedirect(option._id, option.username)}>
                {option.username}
            </p>
        })}
      </div>
      : null

    useEffect(() => {
        //use params to bring up a user after clicking from their page
        //let's check for messages to friend.id and return the most recent message chain
        //if none, create a new one
        if (searchParams.get('friend')) {
            const friendID = searchParams.get('friend')
            const username = searchParams.get('username')
            findFromRedirect(friendID, username)
        }
        getFriends()
    }, [])





    return (
        <div className="inbox">
            <div className="convos">
                <h2>Conversations</h2>

                <button type="button" className={showTo ? 'closeMsg' : 'newMsg'}
                 onClick={startChain}>
                    {!showTo ? '+' : 'X'}
                </button>

                <input className="friendSearch" type={showTo ? 'text' : 'hidden'} name="to" id="to" 
                  placeholder="type in a user to message"
                  value={searchString}
                  onChange={filterOptions}
                  onFocus={() => setDropDownView(true)}/>
                {dropDownView
                    ? <button onClick={() => setDropDownView(false)}>X</button>
                    : null
                }
                {dropDown}
                <InboxList handleClickedMsg={handleClickedMsg} />
                </div>
            <InboxReply openMsg={openMsg} user={user} />
        </div>
    )
}
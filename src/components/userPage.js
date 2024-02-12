import React, { useEffect, useState } from "react";
import { getUserDetail, addFriend, delFriend, getUserIcon } from "../utils/dataAccess";
import FriendsList from "./FriendsList";
import PostCard from "./postCard";
import { useParams } from "react-router-dom";


//need to get id from params
export default function UserPage() {
    const [userDetails, setUserDetails] = useState(null)
    const [friended, setFriended] = useState(false)
    const id = useParams().userid

    async function getUser() {
        const response = await getUserDetail(id)
        const iconBlob = getUserIcon(id)
        if (response.err || iconBlob.err) return null //error handling
        else {
            const imgSrc = URL.createObjectURL(iconBlob)
            response.icon = imgSrc
            setUserDetails(response)
        }

    }

    async function handleFriend() {
        const response = await addFriend(id)
        if (response.err) return response.err //error handling
        else return response
    }

    async function handleDelFriend() {
        const response = await delFriend(id)
        if (response.err) return response.err //error handling
        else return response 
    }

    useEffect(() => {
        getUser()

        return () => setUserDetails(null)
    }, [id])

    const posts = userDetails?.posts.length > 0 
    ? <ul>
        {userDetails.posts.map(post => {
            return <li><PostCard post={post} /></li>
        })}
    </ul>
    : <p>{userDetails.username} has no posts</p>

    //add send inbox button that prepopulates message or pulls up most recent convo

    return (
        <div className="userPage">
            {/*icon*/}
            <img src={userDetails.icon} className="icon" />
            <h1>{userDetails.username}</h1>
            <p>{userDetails.fullName}</p>
            <p>{userDetails.age}</p>
            <p>{userDetails.email}</p>
            <button hidden={friended ? true : false} type="button" onClick={handleFriend}>Add</button>
            <button hidden={friended ? false : true} type="button" onClick={handleDelFriend}>Remove</button>
            <div>
                <FriendsList friends={userDetails.friends} />
            </div>
            <div className="feed">{posts}</div>
        </div>
    )

}
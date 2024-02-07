import React, { useEffect, useState } from "react";
import { getUserDetail, addFriend, delFriend } from "../utils/dataAccess";
import FriendsList from "./FriendsList";
import PostCard from "./postCard";


//need to get id from params
export default function UserPage({id}) {
    const [userDetails, setUserDetails] = useState(null)
    const [friended, setFriended] = useState(false)

    async function getUser() {
        const response = await getUserDetail(id)
        if (response.err) return null //error handling
        else setUserDetails(response)

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
    }, [])

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
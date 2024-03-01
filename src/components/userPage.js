import React, { useEffect, useState } from "react";
import { getUserDetail, addFriend, delFriend, getUserIcon } from "../utils/dataAccess";
import FriendsList from "./FriendsList";
import PostCard from "./postCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { checkUser } from "../utils/auth";
import { useAuthContext } from "../utils/useAuth";
import Icons from "../utils/svgHelper";

//need to get id from params
export default function UserPage() {
    const [userDetails, setUserDetails] = useState(null)
    const [friended, setFriended] = useState(false)
    //const [friended, setFriended] = useState(false)
    const id = useParams().userid
    const navigate = useNavigate()
    const searchParam = new URLSearchParams({friend: id})
    const {user} = useAuthContext()

    async function getUser() {
        const response = await getUserDetail(id)
        if (response.err) return null //error handling
        setUserDetails(response)
        console.log(user)
        setFriended(response?.friends?.includes(user._id))
        if (!response.icon) return
        else {
            const iconBlob = getUserIcon(id)
            const imgSrc = URL.createObjectURL(iconBlob)
            setUserDetails({
                ...userDetails,
                icon: imgSrc
            })
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
        const myUser = checkUser()
        if (!myUser) {
            navigate('/login')
        }
        getUser()
        console.log(userDetails)
        return () => setUserDetails(null)
    }, [id])

    const posts = userDetails?.posts?.length > 0 
    ? <ul>
        {userDetails.posts.map(post => {
            return <li key={post._id}><PostCard post={post} /></li>
        })}
    </ul>
    : <p>{userDetails?.username ? userDetails.username : 'who'} has no posts</p>


    const parseIcon = userDetails?.icon ? 
    <img src={userDetails.icon} className="icon" />
    : null

    const showDetails = userDetails ? 
    <div className="userPage">
    {/*icon*/}
    <div className="userDetails">
        {parseIcon}
        <h1>{userDetails.username}</h1>
        <p>Name: {userDetails.userDetails.fullName}</p>
        <p>Age: {userDetails.userDetails.age}</p>
        <p>Email: {userDetails.userDetails.email}</p>
        <button hidden={friended ? true : false} type="button" onClick={handleFriend}><Icons iconName={'person_add'} /></button>
        <button hidden={friended ? false : true} type="button" onClick={handleDelFriend}><Icons iconName={'person_del'} /></button>
    </div>
    <Link to={`/inbox?${searchParam}`}>
        <Icons iconName={'mail'} />
    </Link>
    <FriendsList friends={userDetails.friends} />
    <div className="myPosts">{posts}</div>
</div> :
    null
    //add send inbox button that prepopulates message or pulls up most recent convo

    return (
        <div>{showDetails}</div>
    )

}
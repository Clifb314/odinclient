import React, {useState} from "react";
import {Link, Outlet} from 'react-router-dom'
import logout from '../utils/auth'
import { acceptReq, delReq, rescReq } from "../utils/dataAccess";
import {v4 as uuid} from 'uuidv4'

export default function Header({ user }) {

    const [showReqs, setShowReqs] = useState(false)

    function handleToggle() {
        showReqs ? setShowReqs(false) : setShowReqs(true)
    }


    //accept request
    async function handleAddFriend(id) {
        const response = await acceptReq(id)
        if (response.err) return response.err //error handling
        else return response
    }

    //delete request
    async function handleDeleteReq(id) {
        const response = await delReq(id)
        if (response.err) return response.err //error handling
        else return response
    }

    async function handleRescind(id) {
        const response = await rescReq(id)
        if (response.err) return response.err //error handling
        else return response
    }

    const pending = user.pending?.length > 0 
    ?  <ul>
        {user.pending.map(req => {
            return <li key={uuid()}>
                        {/*icon*/}
                        <Link to={`users/${req._id}`}>{req.username}</Link>
                        <button type="button" onClick={() => handleRescind(req._id)}></button>
            </li>
        })}
    </ul>
    : null

    //need to make logging in return populated friend request usernames
    const requests = showReqs && user.requests?.length > 0
    ? <div className="friendReqs">
        <p>Friend Requests</p>
        <ul>
            {user.requests.maps(request => {
                return <li key={uuid()}>
                    {/*icon*/}
                    {/*Link to userdetail page*/}
                    <Link to={`users/${request._id}`}>{request.username}</Link>
                    <button type="button" onClick={() => handleAddFriend(request._id)}>+</button>
                    <button type="button" onClick={() => handleDeleteReq(request._id)}>-</button>
                </li>
            })}
            {pending}
        </ul>
    </div>
    : null

    return (
        <div className="header">
                <ul className="headLinks">
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/feed/recent'>Recent Posts</Link></li>
                    <li><Link to={'/feed/top'}>Top Posts</Link></li>
                </ul>
                <div className="logo">Clif Book</div>
                {user ?
                    <ul className="authLinks">
                        <li><Link to='/inbox'>Inbox</Link></li>
                        <li><Link to='/account'>Account</Link></li>
                        <li onClick={handleToggle}>Friend Requests</li>
                        <li><Link onClick={logout} to='/'>Log Out</Link></li>
                    </ul>
                    :
                    <ul className="guestLinks">
                        <li><Link to='/login'>Log In</Link></li>
                        <li><Link to='/register'>Register</Link></li>
                    </ul>
                }
            {requests}
        </div>
    )
}
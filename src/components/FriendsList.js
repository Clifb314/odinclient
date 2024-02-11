import React from "react";
import { Link } from "react-router-dom";



export default function FriendsList({ friends }) {


    const display = friends?.length > 0
    ? <ul>
        {friends.map(friend => {
            {/* icon */}
            return <li><Link to={`/users/${friend._id}`}>
            {friend.username}
            </Link></li>
        })}
    </ul>
    : <p>Empty... Try adding someone!</p>

    return (
        <div className="friendsList">
            <h2>Friends</h2>
            {display}
        </div>
    )
}
import React from "react";



export default function FriendsList({ friends }) {


    const display = friends?.length > 0
    ? <ul>
        {friends.map(friend => {
            {/* icon */}
            return <li>{friend.username}</li>
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
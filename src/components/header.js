import React, {useState} from "react";
import {Link} from 'react-router-dom'

export default function Header({ user }) {



    return (
        <div className="header">
            <ul className="headLinks">
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/feed'>My Feed</Link></li>
            </ul>
            <div className="logo">Clif Book</div>
            {user ? 
                <ul className="authLinks">
                    <li><Link to='/inbox'>Inbox</Link></li>
                    <li><Link to='/account'>Account</Link></li>
                    <li><Link to='/'>Log Out</Link></li>
                </ul>
                :
                <ul className="guestLinks">
                    <li><Link to='/login'>Log In</Link></li>
                    <li><Link to='/register'>Register</Link></li>
                </ul>
            }
        </div>
    )
}
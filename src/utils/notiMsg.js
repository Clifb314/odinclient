import React, { useState, useEffect } from "react";


export default function NotiMsg({type, message, status, onClick}) {

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
      status ? setIsActive(true) : setIsActive(false)
    }, [status])

    return (
        <div className={`noti ${type} ${isActive ? 'active' : 'inactive'}`}>
            <span onClick={onClick}>X</span>
            <p>{message}</p>
        </div>
    )

}
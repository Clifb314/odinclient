import React, { useEffect, useState } from "react";
import { getIcon, getUserIcon } from "./dataAccess";


export default function IconDisplay({icon, userID, username}) {
    const [url, setUrl] = useState(null)


    async function fetchIcon() {
        const response = await getUserIcon(userID)
        if (response.err) return console.log(response.err)
        else {
            console.log(response)
            //response is a blob if succcessful
            setUrl(URL.createObjectURL(response))
        }
    }



    useEffect(() => {
        if (icon) {
            fetchIcon()
            console.log(url)
        }
    },[])

    const display = icon 
    ? <img src={url} alt={`${username}'s icon`} />
    : null

    const text = !icon ? username.slice(0,1) : ''



    return (
        <div className={icon ? 'post-icon' : 'default-icon'}>
            {display}
            {text}
        </div>
    )
}
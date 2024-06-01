import React from "react";
import { useNotis } from "./useToast";


export default function NotiMsg({type, message, onClick}) {



    return (
        <div className={`noti ${type}`}>
            <button onClick={onClick}>X</button>
            <p>{message}</p>
        </div>
    )

}
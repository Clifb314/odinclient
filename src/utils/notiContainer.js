import React from "react";
import { useNotis } from "./useToast";
import NotiMsg from "./notiMsg";


export default function NotiContainer(notis) {

    const {clearNotis, deleteNoti} = useNotis()




    const display = notis.length > 0
     ? notis.map(noti => {
        <NotiMsg key={noti.id} type={noti.type} message={noti} onClick={() => deleteNoti(noti.id)} />
     })
     : null

    const closeAllBtn = notis.length > 1
     ? <button onClick={clearNotis}>Clear</button>
     : null

     return (
        <div className="noti-list">
            {display}
            {closeAllBtn}
        </div>
     )


}
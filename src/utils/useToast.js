import React, { createContext, useContext, useState } from "react";
import {v4 as uuid} from 'uuid'

const toastContext = createContext(null)

export function NotiProvider({children, notis, setNotis}) {


    function clearNotis() {
        setNotis([])
    }

    function deleteNoti(id) {
        setNotis(prev => prev.filter(noti => noti.id !== id))
    }

    function newNoti(type, message) {
        const myNoti = {
            id: uuid(),
            type,
            message
        }
        if (notis.length > 5) {
            //cut the oldest out
            let slice = notis.slice(1)
            setNotis([...slice, myNoti])
        } else {
            setNotis([...notis, myNoti])
        }

        setTimeout(() => deleteNoti(myNoti.id))
    }

    return (
        <toastContext.Provider value={{clearNotis, deleteNoti, newNoti}}>{children}</toastContext.Provider>
    )
}

export function useNotis() {
    return useContext(toastContext)
}
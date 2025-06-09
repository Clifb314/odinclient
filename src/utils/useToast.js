import React, { createContext, useContext } from "react";
import {v4 as uuid} from 'uuid'

const ToastContext = createContext(null)

export function NotiProvider({children, notis, setNotis}) {


    async function clearNotis() {
        //try to trigger slide out animation. slowly?
        inactivateAll().then(() =>
            setTimeout(() => {
                setNotis([])
            }, 500)
        )
    }

    function inactivateAll() {
        return new Promise((resolve, reject) => {
            if (!notis.length) {
                reject({err: "Notifications Empty"})
            } else {
                const newNotis = [...notis].map((noti) => {
                    return {...noti, status: false}
                })
                setNotis(newNotis, resolve({message: "Promises made"}))
            }
  
        })
    }


    function deleteNoti(id) {
        //try to trigger slide out animation w/ map
        const notiPromise = new Promise((resolve, reject) => {
            if (!notis.length) {
                reject({err: "Notifications Empty"})
            } else {
                const newNotis = [...notis].map((noti) => {
                if (noti.id === id) {
                    return {...noti, status: false}
                    } else return noti
                })
                setNotis(newNotis, resolve({message: "Status changed"}))
            }
  
        })
         .then(() => setTimeout(() => {
                setNotis(prev => prev.filter(noti => noti.id !== id))                
                }, 500)
            )
         .catch(err => console.error(err))
    }

    function newNoti(type, message) {
        const myNoti = {
            id: uuid(),
            type,
            message,
            status: true,
        }
        if (notis.length === 0) {
            setNotis([myNoti])
        }
        else if (notis.length >= 5) {
            //cut the oldest out
            let slice = notis.slice(1)
            setNotis([...slice, myNoti])
        } else {
            setNotis([...notis, myNoti])
        }

        setTimeout(() => deleteNoti(myNoti.id), 1000 * 10)
    }

    return (
        <ToastContext.Provider value={{clearNotis, deleteNoti, newNoti}}>{children}</ToastContext.Provider>
    )
}

export function useNotis() {
    return useContext(ToastContext)
}
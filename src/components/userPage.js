import React, { useEffect, useState } from "react";
import { getUserDetail } from "../utils/dataAccess";



export default function UserPage({id}) {
    const [userDetails, setUserDetails] = useState(null)

    async function getUser() {
        const response = await getUserDetail(id)
        if (response.err) return null //error handling
        else setUserDetails(response)

    }

    useEffect(() => {
        getUser()

        return () => setUserDetails(null)
    }, [])


    return (
        <div></div>
    )

}
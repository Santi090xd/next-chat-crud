"use client"

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import socket from "@/utils/socket";

export const TaskContext = createContext()

export const TaskProvider = ({ children })=>{
    
    const [user, setUser] = useState({username:"", chats:[]})
    const [users, setusers] = useState([])

    useEffect(() => {
        if (Cookies.get("token") && !user.username) {
            fetch("/api/user", {
                method: "PATCH",
                body: JSON.stringify({ token: Cookies.get("token") }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(async res => await res.json())
            .then(response => {
                console.log(response.message);
                if (response.message === "Found" && response.user.username) {
                    setUser({username:response.user.username, chats:response.user.chats});
                } else if (response.message === "Not Found") {
                    Cookies.remove("token");
                    location?.reload()
                }
            });
        }
    }, []);

    return (
        <TaskContext.Provider value={{
            user,
            setUser,
            users,
            setusers
        }}>
            {children}
        </TaskContext.Provider>
    )
}
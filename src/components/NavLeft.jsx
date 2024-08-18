"use client"

import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link.js'
import { TaskContext } from '@/context/taskContext'
import socket from '@/utils/socket.js'

export default function NavLeft() {
  const {users, setusers, user} = useContext(TaskContext)

  useEffect(() => {
    const handleUsers = (usuarios)=>{
      setusers(usuarios)
    };
    socket.on("usersList", handleUsers);
    return () => {
      socket.off("users", handleUsers);
    }
  }, [users, setusers, user.username])
  
  const talkedUser = typeof location !== "undefined" ? location.pathname.replace("/chat/", "") : null;

  return (
    <nav className='navLeft'>
      {user.username && <ul>
        {users.map((usuario, i)=> {
          //console.log(usuario.username, usuario.connections);
          if(usuario.username != user.username)return <li key={i}>
              <Link href={`/chat/${usuario.username}`}>
              <div className="flex-user">
              <div className='userConnectionState' style={{backgroundColor:usuario.connections ? "chartreuse" : "#c20202"}}></div>
              <p className={`chatUsername${user.chats && talkedUser && user.chats.find(a => a.username == usuario.username)?.read == false ? " chatNewMsg" : ""}`}>{usuario.username}</p>
              </div>
              </Link>
          </li>
        })}
      </ul>}
    </nav>
  )
}

"use client"

import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link.js'
import { TaskContext } from '@/context/taskContext'
import socket from '@/utils/socket.js'

export default function NavLeft() {
  const {users, setusers, user} = useContext(TaskContext)

  useEffect(() => {
    const handleUsers = (usuarios)=>{
      setusers(usuarios.filter(a => a != user.username))
    };
    socket.on("usersList", handleUsers);
    return () => {
      socket.off("users", handleUsers);
    }
  }, [users, setusers, user.username])
  
  

  return (
    <nav className='navLeft'>
      {user.username && <ul>
        {users.map((usuario, i)=> {
          if(usuario != user.username)return <li key={i}>
              <Link href={`/chat/${usuario}`}>
              <div className="flex-user">{usuario}</div>
              </Link>
          </li>
        })}
      </ul>}
    </nav>
  )
}

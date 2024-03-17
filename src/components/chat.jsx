"use client"

import { TaskContext } from '@/context/taskContext'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import socket from '@/utils/socket.js'

export default function Chat({talkedUser}) {
  const [redirect, setRedirect] = useState(false);
  const {user, users, setUser} = useContext(TaskContext)
  const router = useRouter();
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [Error, setError] = useState(false)
  
    useEffect(()=>{
      if(!Cookies.get("token")) setRedirect(true);
      if(user.username == talkedUser) setRedirect(true)
    }, [user, talkedUser])
    useEffect(()=>{
      if(redirect) router.push("/")
    }, [redirect, router])
    useEffect(()=>{
      if(user && user.username){
        socket.emit("chatMessagesList", {talkedUser, user:user.username})
      }
    }, [users, talkedUser, user])
    useEffect(() => {
      const getMessagesList = (msjs)=>{
        setUser((usuario) =>({...usuario, chats:[...usuario.chats, {[talkedUser]:msjs}]}))
        if(msjs.talkedUser == talkedUser) setMessages(msjs.chat)
      }
      const enviarMsg = (msg)=>{
        if(msg == "Not Found"){
          setError(true)
          setTimeout(() => {
            setRedirect(true)
          }, 2000);
        }
        setSending(false);
        setMessages((mensajes)=>[...mensajes, msg])
      }
      socket.on("chatMessagesList", getMessagesList)
      socket.on("chatMessage", enviarMsg)
      return () => {
        socket.off("chatMessagesList", getMessagesList)
        socket.off("chatMessage", enviarMsg)
      }
    }, [user, setUser, talkedUser])
    useEffect(()=>{
      if(user.username) document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    }, [messages, user.username])
  return (
    user.username && (<div className='chatCont'>
    <form className='chatForm' onSubmit={(e)=>{
      e.preventDefault();
      if (message.trim()) {
        socket.emit("chatMessage", {user:user.username, content:message.trim(), talkedUser})
        setSending(true)
        setMessage("")
      }
    }}>
        <h1 className='chatTitle'>Chat</h1>
        <ul id='chat'>
          {Error ? (<div className='error'>
          <h1>Error 404 Not Found!</h1>
          <p>redirecting to the main page...</p>
          </div>) : (<></>)}
            {messages.map((msj, i)=>(
                  <li key={i} className={`message${msj.user == user.username ? " author" : ""}`} id={`message${i}`}>
                    <div className='flex-msg'>
                    <div className={`msg${msj.user == user.username ? " Author" : " nAuthor"}`}>
                    {msj.user == user.username ? "" : (<span className='msgUser'>{msj.user}</span>)}
                      <p className='msgContent'>{msj.content}</p>
                    </div>
                    </div>
                  </li>
            ))}
        </ul>
        <input
        type="text"
        placeholder='Type something'
        className='inputChat'
        value={message}
        onChange={(e)=>{
            setMessage(e.target.value.trimStart())
        }} />
        <button id='send' disabled={sending || Error}>Send</button>
    </form>
    </div>)
  )
}

"use client"

import Link from 'next/link.js';
import { TaskContext } from '@/context/taskContext'
import { useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import Header from './header';
import socket from '@/utils/socket';

export default function Navigation() {
    const { user, setUser } = useContext(TaskContext)
    setInterval(() => {
        if(!Cookies.get("token") && typeof window !== 'undefined' && user.username) window?.location.reload();
    }, 2500);

    console.log(user);
    useEffect(() => {
      socket.connect()
    
      return () => {
        socket.disconnect()
      }
    }, [])

    useEffect(()=>{
        if(Cookies.get("token")){
            socket.emit("userConnected", Cookies.get("token"))
        }
    }, [user])
    
    return (
        <div className='homePage'>
            {user.username && Cookies.get("token") ? (
                <>
                    <nav>
                    <Header user={user}/>
                    </nav>
                </>
            ) : (
                <>
                    <h1>hola xd</h1>
                    <button className='loginBtn'>
                        <Link href="/login">Login</Link>
                    </button>
                    <button className='signUpBtn'>
                        <Link href="/signup"> Sign up</Link>
                    </button>
                </>
            )}
        </div>
    )
}

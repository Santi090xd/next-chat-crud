import React from 'react'
import Chat from "@/components/chat";
import Navigation from '@/components/Navigation';
import NavLeft from '@/components/NavLeft';

export default function PrivateChat({params}) {
  return (
    <>
    <Navigation/>
    <main style={{display:"flex"}}>
      <NavLeft/>
      <Chat talkedUser={params.user}/>
    </main>
    </>
  )
}

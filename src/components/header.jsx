import React from 'react'
import Cookies from 'js-cookie'

export default function Header({user}) {
  return (
    <nav className='chat-nav'>
      <h3 className='navUsername'>{user.username}</h3>
        <button className='nav-log-out' type="button" onClick={() => {
          Cookies.remove("token");
          location.reload();
        }}>
          Log out
        </button>
    </nav>
  )
}

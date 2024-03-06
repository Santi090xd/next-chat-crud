import React from 'react'
import Cookies from 'js-cookie'

export default function Header({user}) {
  return (
    <>
      <h2>Hello {user.username}</h2>
        <button className='nav-log-out' type="button" onClick={() => {
          Cookies.remove("token");
          location.reload();
        }}>
          Log out
        </button>
    </>
  )
}

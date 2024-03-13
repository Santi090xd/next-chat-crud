"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

const Login = () => {
  const router = useRouter();
  if(document && document.cookie?.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")) return location.pathname = "/"
  const [user, setUser] = useState({ username: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(()=>{
    if(redirect){
      router.push("/")
    }
  }, [redirect, router])

  useEffect(() => {
    if (error === "incorrect Password!") {
        document.querySelector(".password")?.focus();
    } else if(error && error != "incorrect Password!"){
      document.querySelector(".username")?.focus();
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch(`/api/user`, {
        method: "POST",
        body: JSON.stringify({ username: user.username, password: user.password }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const response = await res.json();
      if (response.message === "Found!") {
        Cookies.set("token", response.token);
        setRedirect(true)
      } else {
        setError(response.message);
      }
      if(response.message == "?"){
        document.body.innerHTML = "<h1>Algo no salio bien, intentalo de nuevo.</h1>";
        return setRedirect(true)
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value.trim() }));
    setError("")
  };

  const inputClassName = (field) => {
    return error && error == "incorrect Password!" ? field + " error" : field;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="formCont">
        <div className={`form ${error && error == "incorrect Password!" || error == "Not Found" ? "error" : ""}`}>
          <button type="button" className='exitBtn'></button>
          <div className="baseCont">
            <h1 className='title'>Login :)</h1>
          </div>
          <input
            type='text'
            placeholder='username'
            name='username'
            value={user.username}
            required
            autoFocus
            disabled={sending}
            className="username"
            onChange={handleChange}
            onKeyUp={(e)=>{
              if(e.code == "Enter" || e.code == "Enter" && e.shiftKey) document.querySelector(".password").focus()
            }}
          />
          <input
            type='password'
            name='password'
            placeholder='password'
            autoComplete='off'
            value={user.password}
            required
            disabled={sending}
            className={inputClassName('password')}
            onChange={handleChange}
          />
          <button
            type='submit'
            id='send'
            disabled={sending || error || !(user.username.length >= 2 && user.password.length >= 2)}
          >
            {sending ? "Loading..." : "Send"}
          </button>
      {error && <p className="notFoundMsg error">{error}</p>}
        </div>
      </div>
    </form>
  );
};

export default Login;

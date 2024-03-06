"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SignUpForm() {
  const router = useRouter();
  if(Cookies.get("token")) return location.pathname = "/"
    const [user, setUser] = useState({ username: "", password: "" });
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (error === "this user already exists") {
            document.querySelector(".username")?.focus();
        }
    }, [error]);

    const onSubmitxd = async (e) => {
        e.preventDefault();
        setError("");
        setSending(true);
        try {
            const res = await fetch(`/api/user`, {
                method: "PUT",
                body: JSON.stringify({ username: user.username, password: user.password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const response = await res.json();

            if (response.message === "user created") {
                Cookies.set("token", response.user.token)
                router.push("/");
                return;
            } else if (response.message === "?") {
                document.body.innerHTML = "Unexpected Error, try again!";
                setTimeout(() => {
                    router.push("/");
                }, 1000);
                return;
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setSending(false);
        }
    };

    const onChangexd = (e) => {
        const { name, value } = e.target;
        setUser((userxd) => ({...userxd, [name]: value}));
        setError("");
    };

    return (
        <form id='signUp' onSubmit={onSubmitxd}>
            <div className="formCont">
                <div className={`form ${error && "error"}`}>
                    <button type="button" className='exitBtn'></button>
                    <div className="baseCont">
                        <h1 className='title'>Sign Up :)</h1>
                    </div>
                    <input
                        type='text'
                        placeholder='username'
                        name='username'
                        className='username'
                        value={user.username}
                        autoComplete='off'
                        required
                        disabled={sending}
                        onChange={onChangexd}
                        autoFocus
                        onKeyUp={(e)=>{
                          if(e.code == "Enter") document.querySelector(".password").focus()
                        }}
                    />
                    <input
                        type='password'
                        name='password'
                        className='password'
                        placeholder='password'
                        value={user.password}
                        autoComplete='off'
                        required
                        disabled={sending}
                        onChange={onChangexd}
                    />
                    <button
                        id='send'
                        type='submit'
                        disabled={sending || error || !(user.username.length >= 2 && user.password.length >= 2)}
                    >
                        {sending ? "Loading..." : "Send"}
                    </button>
                    {error && <p className='error'>Error: {error}</p>}
                </div>
            </div>
        </form>
    );
}

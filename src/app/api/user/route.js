import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db.js";
import User from "@/models/users.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import socket from "@/utils/socket";

export async function PUT(req, {params}){
    if(req.cookies["token"]) return NextResponse.json({message:"?"});
    const { username, password } = await req.json();
    if(!username || !password) return NextResponse.json({message:"?"})
    connectDB()
    try {
        const passwordHash = await bcryptjs.hash(password, 8)
        if(await User.findOne({username})){
            return NextResponse.json({message:"this user already exists"})
        } else {
            const user = new User({username, password:passwordHash});
            const usuariosGuardados = await user.save()
            console.log("user created", usuariosGuardados._id.toString());
            let token = await new Promise((resolve, reject) => {
                jwt.sign({id: usuariosGuardados._id.toString()},process.env.secret, {expiresIn: "1day"}, (err, token) => {
                    if(err) reject(err);
                    resolve(token)
                })
            })
            if(!token) return NextResponse.json({message:"Error"})
            return NextResponse.json({message:"user created", user:{username, token:token}})
        }
    } catch (error) {
        console.error("error: " + error)
        return NextResponse.json({message:error.message})
    }
}

export async function POST(req) {
    if(req.cookies["token"]) return NextResponse.json({message:"?"});
    const {username, password} = await req.json()
    if(!username || !password) return NextResponse.json({message:"?"})
    try {
        connectDB()
        let user = await User.findOne({username});
        if(!user) return NextResponse.json({message: "Not Found"})
        if(user){
            if(await bcryptjs.compare(password, user.password)){
                let token = await new Promise((resolve, reject) => {
                    jwt.sign({id: user._id.toString()},process.env.secret, {expiresIn: "1day"}, (err, token)=>{
                        if(err) reject(err)
                        resolve(token)
                    })
                })
                return NextResponse.json({message:"Found!", token})
            } else return NextResponse.json({message: "incorrect Password!"})
        }
    } catch (error) {
        console.log("error: " + error.stack);
        return NextResponse.json({message:"Not Found"})
    }
}

export async function PATCH(req) {
    const {token} = await req.json();
    let decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.secret, async (err, decoded)=>{
            if(err) {
                if(err.message == "invalid signature" || err.message == "jwt expired") resolve(false)
                reject(err.message)
            }
            if(decoded) resolve(decoded)
        })
    })
    if(!decoded) return NextResponse.json({message:"Not Found"})
    connectDB();
    let user = await User.findById(decoded.id)
    if(!user) return NextResponse.json({message: "Not Found", user:null})
    if(user && user._id.toString() === decoded.id) {
        return NextResponse.json({message: "Found", user:{username:user.username, chats:user.chats.map(chat => {
            return {
                talkedUser: chat.username,
                read: chat.read,
                chat: chat.messages.map(msg => ({content:msg.content, user:msg.user, timestamp:msg.timestamp}))
            }
        }), token:token}});
    }
}
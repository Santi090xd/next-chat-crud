import { connect, connection } from "mongoose";
import "dotenv/config"

let isConnected = false

export async function connectDB(){
    if(isConnected) return;
    const db = await connect(process.env.dbURL, {
        serverSelectionTimeoutMS:5000
    });
    console.log("dbName",db.connection.db?.databaseName);
    isConnected = true
}

connection.on("connected", ()=>{
    console.log("conectado a la DB")
});

connection.on("error", (err)=>{
    console.log("Hubo un Problema al conectarse a la DB", err)
})
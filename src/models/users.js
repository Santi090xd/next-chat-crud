import { Schema, model, models } from "mongoose";

export default models.users || model("users", new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    chats: [{
        username: String,
        messages: [{
            content: String,
            user: String,
            id:String,
            timestamp: Date
        }]
    }],
    connections:{
        type:[String]
    }
}, {
    timestamps:true
}))
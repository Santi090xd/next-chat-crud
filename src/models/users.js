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
    connections:{
        type:[String]
    },
    chats: [{
        username: String,
        read: {
            type:Boolean,
            default:false
        },
        messages: [{
            content: String,
            user: String,
            id:String,
            timestamp: Date
        }]
    }]
}, {
    timestamps:true
}))
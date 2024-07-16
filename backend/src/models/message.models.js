import { Schema, model } from "mongoose";

const messageSchema  = new Schema({
  message:{
    type:String
  }
},{timestamps:true})
const Message  = new model("Message",messageSchema)
export default Message

import * as mongoose from "mongoose";
import Chat from "./Chat";
import Message from './Message';

const chatSchema = new mongoose.Schema({
  members: [],
  messages: Array<Message>()
 
});

const chatModel = mongoose.model<Chat & mongoose.Document>("Chat", chatSchema);

export default chatModel;

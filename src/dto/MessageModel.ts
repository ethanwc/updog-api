import * as mongoose from "mongoose";
import Message from "./Message";

const messageSchema = new mongoose.Schema({
  chatid: String,
  author: String,
  date: String,
  content: String,
  type: String
});

const messageModel = mongoose.model<Message & mongoose.Document>(
  "Message",
  messageSchema
);

export default messageModel;

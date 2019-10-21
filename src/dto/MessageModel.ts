import * as mongoose from "mongoose";
import Message from "./Message";

const messageSchema = new mongoose.Schema({
  author: String,
  date: String,
  content: String,
  type: Number
});

const messageModel = mongoose.model<Message & mongoose.Document>(
  "Message",
  messageSchema
);

export default messageModel;

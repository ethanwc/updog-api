import * as mongoose from "mongoose";
import User from "./User";
import Chat from "./Chat";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  about: String,
  location: String,
  password: String,
  status: String,
  imageurl: String,
  following: [],
  followers: [],
  chats: Array<Chat>()
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;

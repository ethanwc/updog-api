import * as mongoose from "mongoose";
import User from "./User";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  about: String,
  location: String,
  password: String,
  status: String,
  following: [],
  followers: []
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;

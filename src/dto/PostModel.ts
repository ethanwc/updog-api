import * as mongoose from "mongoose";
import Post from "./Post";

const postSchema = new mongoose.Schema({
  authorid: String,
  content: String,
  title: String,
  date: String,
  likes: [],
  favorites: [],
  comments: []
});

const postModel = mongoose.model<Post & mongoose.Document>("Post", postSchema);

export default postModel;

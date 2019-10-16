import * as mongoose from "mongoose";
import Post from "./post.interface";

const postSchema = new mongoose.Schema({
  author: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  },
  content: String,
  title: String,
  date: String,
  likes: [],
  favorites: [],
  comments: []
});

const postModel = mongoose.model<Post & mongoose.Document>("Post", postSchema);

export default postModel;

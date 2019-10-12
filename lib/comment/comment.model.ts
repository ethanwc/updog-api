import * as mongoose from "mongoose";
import Comment from "./comment.interface";

const postSchema = new mongoose.Schema({
  author: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId
  },
  comment: String,
  post: postId
});

const commentModel = mongoose.model<Comment & mongoose.Document>(
  "Comment",
  postSchema
);

export default commentModel;

import { Request, Response, Router, Express } from "express";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

import { logger } from "@shared";
import User from "../../dto/User";
import Post from "../../dto/Post";
import UserModel from "../../dto/UserModel";
import PostModel from "../../dto/PostModel";

// Init shared
const router = Router();
// User Model
const User = UserModel;
// Post Model
const Post = PostModel;

/******************************************************************************
 *                      Test the Posts route - "GET /api/posts/test"
 ******************************************************************************/

router.get("/test", async (req: Request, res: Response) =>
  res.status(OK).json("test")
);

/******************************************************************************
 *                      All Posts of a User - "POST /api/posts/:id"
 ******************************************************************************/

router.post("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId }).select("-password");
    return res.status(OK).json({ posts });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Get all Posts - "GET /api/posts/"
 ******************************************************************************/

router.post("/:id/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author", "-password");
    return res.status(OK).json({ posts });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Update a post - "PATCH /api/posts/:id"
 ******************************************************************************/

router.patch("/posts/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId }).select("-password");
    return res.status(OK).json({ posts });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Delete a post - "DELETE /api/posts/:id"
 ******************************************************************************/

router.delete("/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    PostModel.findByIdAndDelete(id).then(response => {
      if (response) return res.status(OK);
      else return res.status(NOT_FOUND);
    });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Create a post - "POST /api/posts/"
 ******************************************************************************/

router.post("/posts/", async (req: Request, res: Response) => {
  try {
    const postData: Post = req.body;
    const createdPost = new Post({
      ...postData,
      author: req.body.user._id
    });
    const savedPost = await createdPost.save();
    await savedPost.populate("author").execPopulate();
    return res.status(OK).json(savedPost);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;

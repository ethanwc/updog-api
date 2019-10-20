import { Request, Response, Router, Express } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";
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
 *                      All Posts of a User - "POST /api/users/:id/posts"
 ******************************************************************************/

router.post("/:id/posts", async (req: Request, res: Response) => {
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
 *                                     Export
 ******************************************************************************/

export default router;

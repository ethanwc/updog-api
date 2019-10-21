import { Request, Response, Router, Express } from "express";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from "http-status-codes";
import { logger } from "@shared";
import Chat from "../../dto/Chat";
import UserModel from "../../dto/UserModel";
import ChatModel from "../../dto/ChatModel";
import Message from "src/dto/Message";

// Init shared
const router = Router();
// User Model
const User = UserModel;
// Chat Model
const Chat = ChatModel;

/******************************************************************************
 *                  Test the Chat route - "GET /api/chat/test"
 ******************************************************************************/

router.get("/test", async (req: Request, res: Response) =>
  res.status(OK).json("test")
);

/******************************************************************************
 *                  Create a new Chat - "POST /api/chat"
 ******************************************************************************/

router.post("/", async (req: Request, res: Response) => {
  try {
    const newChat = new Chat({
      members: req.body.members,
      messages: []
    });
    const savedChat = await newChat.save();
    return res.status(CREATED).json({ savedChat });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Delete a chat - "DELETE /api/chat/:id"
 ******************************************************************************/

router.delete("/", async (req: Request, res: Response) => {
  try {
    const newChat = new Chat({
      members: req.body.members,
      messages: Array<Message>()
    });
    const savedChat = await newChat.save();
    return res.status(CREATED).json({ savedChat });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});
/******************************************************************************
 *       Check if a chat exists between two users - "GET /api/chat/lookup"
 ******************************************************************************/

/******************************************************************************
 *        Check if a chat exists between two users - "GET /api/posts/"
 ******************************************************************************/

/******************************************************************************
 *                      Check if a chat exists between two users - "GET /api/posts/"
 ******************************************************************************/

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
    return res.status(CREATED).json(savedPost);
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
 *                                     Export
 ******************************************************************************/

export default router;

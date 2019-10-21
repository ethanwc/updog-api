import { Request, Response, Router } from "express";
import { BAD_REQUEST, CREATED, OK, NOT_FOUND } from "http-status-codes";
import { logger } from "@shared";
import Chat from "../../dto/Chat";
import Message from "../../dto/Message";
import UserModel from "../../dto/UserModel";
import ChatModel from "../../dto/ChatModel";
import MessageModel from "../../dto/MessageModel";

// Init shared
const router = Router();
// User Model
const User = UserModel;
// Chat Model
const Chat = ChatModel;
// Message Model
const Message = MessageModel;

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
    //todo: check if chat already exists.
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

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    ChatModel.findByIdAndDelete(chatId).then(response => {
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
 *     Check if a chat exists between two users - "POST /api/chat/lookup"
 ******************************************************************************/

router.post("/lookup", async (req: Request, res: Response) => {
  try {
    const member1 = req.body.members[0];
    const member2 = req.body.members[1];
    User.findById(member1).then(member1 => {
      if (member1) {
        member1.chats.forEach(element => {
          if (element.members.includes(member2))
            return res.status(OK).json(element._id);
        });
        return res.status(NOT_FOUND).json(0);
      }
    });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *              Send a message to a chat - "POST /api/chat/message"
 ******************************************************************************/

router.post("/message", async (req: Request, res: Response) => {
  try {
    //todo: use pushy here and add listener in frontend
    const chatId = req.body.chatId;
    const messageData: Message = req.body.message;
    const createdMessage = new Message(messageData);
    const savedMessage = await createdMessage.save();
    const messageId = savedMessage._id;
    ChatModel.findById(chatId).then(chat => {
      if (chat) {
        chat.messages.push(messageId);
        return res.status(OK);
      } else return res.status(NOT_FOUND);
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

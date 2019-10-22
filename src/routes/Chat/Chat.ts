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
 *           Get all messages for a chat - "get /api/chat/:id"
 ******************************************************************************/

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const messages = await Message.find({ chatid: id });
    return res.status(OK).json(messages);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 * Get all chats and associated messages for a user - "get /api/chat/:id/all"
 ******************************************************************************/

router.get("/:id/all", async (req: Request, res: Response) => {
  //want all messages for each chat
  try {
    const userid = req.params.id;
    User.findById(userid).then(async user => {
      if (user) {
        let chats: Array<Chat> = [];
        for (const c of user.chats) {
          await Chat.findById(c).then(async chat => {
            if (chat) {
              console.log(chat.members);
              const messages = await Message.find({ chatid: c });
              chats.push({ _id: c, members: chat.members, messages: messages });
            }
          });
        }
        return res.status(OK).json(chats);
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
 *                  Create a new Chat - "POST /api/chat/create"
 ******************************************************************************/

router.post("/create", async (req: Request, res: Response) => {
  try {
    //checks if two users are in the same chat
    const member1 = req.body.members[0];
    const member2 = req.body.members[1];
    User.findById(member1).then(member1 => {
      if (member1) {
        User.findById(member2).then(async member2 => {
          if (member2) {
            const intersection = member1.chats.filter(element =>
              member2.chats.includes(element)
            );

            if (intersection.length > 0)
              return res.status(OK).json(intersection);
            else {
              //create new chat since one doesn't exist between users
              const newChat = new Chat({
                members: req.body.members,
                messages: []
              });
              const savedChat = await newChat.save();

              //add chatid to both member's profile data
              member1.chats.push(savedChat._id);
              User.findByIdAndUpdate(member1._id, member1).then(_ => {
                User.findById(member2).then(member2 => {
                  if (member2) {
                    member2.chats.push(savedChat._id);
                    User.findByIdAndUpdate(member2._id, member2).then(_ => {
                      return res.status(CREATED).json({ savedChat });
                    });
                  } else return res.status(NOT_FOUND);
                });
              });
            }
          } else return res.status(NOT_FOUND);
        });
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
 *              Send a message to a chat - "POST /api/chat/message"
 ******************************************************************************/

router.post("/message", async (req: Request, res: Response) => {
  try {
    //todo: use pushy here and add listener in frontend
    const chatId = req.body.chatId;
    let messageData: Message = req.body;
    messageData.chatid = chatId;
    const createdMessage = new Message(messageData);
    const savedMessage = await createdMessage.save();
    const messageId = savedMessage._id;
    ChatModel.findById(chatId).then(chat => {
      if (chat) {
        chat.messages.push(messageId);
        ChatModel.findByIdAndUpdate(chatId, chat).then(chat => {
          if (chat) return res.status(CREATED).json(chat);
          else return res.status(NOT_FOUND);
        });
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
 *                    Delete a chat - "DELETE /api/chat/:id"
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
 *                                     Export
 ******************************************************************************/

export default router;

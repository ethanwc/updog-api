import Message from "./Message";

interface Chat {
  _id: any;
  members: Array<String>;
  messages: Array<Message>;
}

export default Chat;

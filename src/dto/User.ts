import Chat from './Chat';

interface User {
  _id: any;
  name: string;
  email: string;
  username: string;
  about: string;
  location: string;
  password: string;
  status: string;
  imageurl: string;
  following: Array<string>;
  followers: Array<string>;
  chats: Array<Chat>;
}
export default User;

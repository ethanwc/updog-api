interface User {
  _id: any;
  name: string;
  email: string;
  username: string;
  about: string;
  location: string;
  password: string;
  status: string;
  following: Array<string>;
  followers: Array<string>;
}
export default User;

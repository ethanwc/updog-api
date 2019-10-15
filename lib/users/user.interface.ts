interface User {
  _id: any;
  name: string;
  email: string;
  username: string;
  about: string;
  location: string;
  password: string;
  following: [];
  followers: [];
}
export default User;

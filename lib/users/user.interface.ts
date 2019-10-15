interface User {
  _id: any;
  name: String;
  email: String;
  username: String;
  about: String;
  location: String;
  password: String;
  following: [];
  followers: [];
}
export default User;

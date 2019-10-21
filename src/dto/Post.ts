interface Post {
  _id: any;
  content: string;
  title: string;
  date: string;
  likes: [];
  favorites: [];
  comments: [];
}

export default Post;

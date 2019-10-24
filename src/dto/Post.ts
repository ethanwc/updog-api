interface Post {
  authorid: string;
  content: string;
  title: string;
  date: string;
  type: string;
  likes: [];
  favorites: [];
  comments: [];
}

export default Post;

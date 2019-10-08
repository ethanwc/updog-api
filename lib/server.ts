import App from "./app";
import PostsController from "./posts/posts.controller";
require("dotenv").config();

const app = new App([new PostsController()]);

app.listen();

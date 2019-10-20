import App from "./app";
import PostsController from "./posts/posts.controller";
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./users/user.controller";
require("dotenv").config();

//specifies what controls the api has
const app = new App([new PostsController(), new AuthenticationController(), new UserController()]);

app.listen();

import * as express from "express";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/RequestWithUser";
import authMiddleware from "../middleware/auth.middleware";
import postModel from "../posts/post.model";
import userModel from "../users/user.model";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser)
      .get(`${this.path}/:id/info`, this.getUserInfo);
  }

  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userId = request.params.id;
    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    } else next(new NotAuthorizedException("1"));
  };

  private getUserInfo = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userId = request.params.id;

    let info = await this.user.find({ _id: userId }).select("-password");

    response.send(info);
  };
}

export default UserController;

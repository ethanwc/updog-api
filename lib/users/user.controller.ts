import * as express from "express";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/RequestWithUser";
import authMiddleware from "../middleware/auth.middleware";
import postModel from "../posts/post.model";

class UserController implements Controller {
  public path = "/users";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser
    );
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
    }
    next(new NotAuthorizedException("1"));
  };
}

export default UserController;

import * as express from "express";
import Controller from "../interfaces/controller";
import Post from "./post.interface";
import postModel from "./post.model";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import AuthorizationMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser";

/**
 * Handles API logic for operations on posts.
 */
class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Declares post routes
   */

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, AuthorizationMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        AuthorizationMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }

  private getAllPosts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const posts = await this.post.find().populate("author", "-password");
    response.send(posts);
  };

  /**
   * Gets a post by author id
   */
  private getPostById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    this.post.find(id).then(post => {
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  /**
   * Updates a post
   */
  private modifyPost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true }).then(post => {
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  /**
   * Deletes a post
   */
  private deletePost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id).then(successResponse => {
      if (successResponse) {
        response.send(200);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  /**
   * Creates a new post
   */
  private createPost = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const postData: CreatePostDto = request.body;
    const createdPost = new this.post({
      ...postData,
      author: request.user._id
    });
    const savedPost = await createdPost.save();
    await savedPost.populate("author").execPopulate();
    response.send(savedPost);
  };
}

export default PostsController;

import * as express from "express";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import FailedFollowingException from "../exceptions/FailedFollowingException";
import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/RequestWithUser";
import authMiddleware from "../middleware/auth.middleware";
import postModel from "../posts/post.model";
import userModel from "../users/user.model";
import User from "./user.interface";

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
      .get(`${this.path}/:id/posts`, this.getAllPostsOfUser)
      .get(`${this.path}/:id/info`, this.getUserInfo)
      .post(`${this.path}/follow`, authMiddleware, this.followUser);
  }

  //returns all posts of a user
  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const userId = request.params.id;
    const posts = await this.post.find({ author: userId }).select("-password");
    response.send(posts);
  };

  //returns the profile info for specified user
  private getUserInfo = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    const userId = request.params.id;

    const info = await this.user.find({ _id: userId }).select("-password");

    response.send(info);
  };

  //toggles following a user
  private followUser = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const persontofollow: string = request.body.followe;
    const follower: string = request.body.follower;

    this.user
      .findById(persontofollow)
      .select("-password")
      .then(persontofollow_data => {
        if (persontofollow_data) {
          this.user
            .findById(follower)
            .select("-password")
            .then(follower_data => {
              if (follower_data) {
                //determine if user clicking follow is already following.

                let followerFollowing: string[] = follower_data.following;
                let personFollowedBy: string[] = persontofollow_data.followers;

                if (
                  followerFollowing.includes(persontofollow_data._id) ||
                  personFollowedBy.includes(follower_data._id)
                ) {
                  //if already followed - remove
                  console.log("removing");
                  followerFollowing.splice(
                    followerFollowing.indexOf(persontofollow_data._id)
                  );

                  personFollowedBy.splice(
                    personFollowedBy.indexOf(follower_data._id)
                  );
                } else {
                  //add to lists
                  console.log("adding");
                  followerFollowing.push(persontofollow_data._id);
                  personFollowedBy.push(follower_data._id);
                }

                let person: User = persontofollow_data.toJSON();
                person.followers = personFollowedBy;

                let follower: User = follower_data.toJSON();
                follower.following = followerFollowing;

                // console.log(person);
                // console.log(follower);

                //updated users
                const updatedPerson: User = person;
                const updatedFollower: User = follower;

                //update users
                this.user
                  .findByIdAndUpdate(person._id, updatedPerson, {
                    new: true
                  })
                  .select("-password")
                  .then(user1 => {
                    if (user1) {
                      this.user
                        .findByIdAndUpdate(follower._id, updatedFollower, {
                          new: true
                        })
                        .then(user2 => {
                          if (user2) {
                            response.send(user2);
                          } else next(new FailedFollowingException("1"));
                        });
                    } else next(new FailedFollowingException("1"));
                  });
              } else {
                next(new NotAuthorizedException("11/77"));
              }
            });
        } else {
          next(new NotAuthorizedException("11/77"));
        }
      });
  };
}

export default UserController;

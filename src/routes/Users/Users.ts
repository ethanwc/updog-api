import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, NOT_FOUND, CONFLICT } from "http-status-codes";

import { logger } from "@shared";
import User from "../../dto/User";
import UserModel from "../../dto/UserModel";
import PostModel from "../../dto/PostModel";

// Init shared
const router = Router();
// User Model
const User = UserModel;
// Post Model
const Post = PostModel;

/******************************************************************************
 *                      Test the Users route - "GET /api/users/test"
 ******************************************************************************/

router.get("/test", async (req: Request, res: Response) =>
  res.status(OK).json("test")
);

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate("-password");
    return res.status(OK).json({ users });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Return User Info - "POST /api/users/:id/info"
 ******************************************************************************/

router.post("/:id/info", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const info = await User.find({ _id: userId }).select("-password");
    return res.status(OK).json(info);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Follow a User - "POST /api/users/follow"
 ******************************************************************************/

router.post("/follow", async (req: Request, res: Response) => {
  try {
    const persontofollow: string = req.body.followe;
    const follower: string = req.body.follower;

    User.findById(persontofollow)
      .select("-password")
      .then(persontofollow_data => {
        if (persontofollow_data) {
          User.findById(follower)
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
                  followerFollowing.splice(
                    followerFollowing.indexOf(persontofollow_data._id)
                  );

                  personFollowedBy.splice(
                    personFollowedBy.indexOf(follower_data._id)
                  );
                } else {
                  //add to lists
                  followerFollowing.push(persontofollow_data._id);
                  personFollowedBy.push(follower_data._id);
                }

                let person: User = persontofollow_data.toJSON();
                person.followers = personFollowedBy;

                let follower: User = follower_data.toJSON();
                follower.following = followerFollowing;

                //updated users
                const updatedPerson: User = person;
                const updatedFollower: User = follower;

                //update users
                User.findByIdAndUpdate(person._id, updatedPerson, {
                  new: true
                })
                  .select("-password")
                  .then(user1 => {
                    if (user1) {
                      User.findByIdAndUpdate(follower._id, updatedFollower, {
                        new: true
                      }).then(user2 => {
                        if (user2) {
                          res.status(OK).json(user2);
                        } else res.status(CONFLICT);
                      });
                    } else res.status(NOT_FOUND);
                  });
              } else res.status(NOT_FOUND);
            });
        } else res.status(NOT_FOUND);
      });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                       Update Profile - "POST /api/users/profile"
 ******************************************************************************/

router.post("/profile", async (req: Request, res: Response) => {
  try {
    const id: string = req.body.id;
    const location: string = req.body.location;
    const about: string = req.body.about;

    User.findById(id).then(user => {
      if (user) {
        let updatedUser = user.toJSON();
        updatedUser.location = location;
        updatedUser.about = about;
        User.findByIdAndUpdate(id, updatedUser, {
          new: true
        })
          .select("-password")
          .then(user => {
            if (user) {
              res.status(OK).json(user);
            }
          });
      } else res.status(NOT_FOUND);
    });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                    Update Status - "POST /api/users/status"
 ******************************************************************************/

router.post("/status", async (req: Request, res: Response) => {
  try {
    const id: string = req.body.id;
    const newStatus: string = req.body.status;

    User.findById(id).then(user => {
      if (user) {
        let updatedUser = user.toJSON();
        updatedUser.status = newStatus;
        User.findByIdAndUpdate(id, updatedUser, {
          new: true
        })
          .select("-password")
          .then(user => {
            if (user) {
              res.send(user);
            }
          });
      }
    });
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;

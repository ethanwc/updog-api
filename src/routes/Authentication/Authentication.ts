import { Request, Response, Router, Express } from "express";
import {
  BAD_REQUEST,
  CREATED,
  OK,
  NOT_FOUND,
  UNAUTHORIZED
} from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { logger } from "@shared";
import User from "../../dto/User";
import Post from "../../dto/Post";
import Login from "../../dto/Login";
import UserModel from "../../dto/UserModel";
import PostModel from "../../dto/PostModel";

interface TokenData {
  token: string;
  expiresIn: number;
}

interface DataStoredInToken {
  _id: string;
}

// Init shared
const router = Router();
// User Model
const User = UserModel;

/******************************************************************************
 *                      Test the Authentication route - "GET /api/auth/test"
 ******************************************************************************/

router.get("/test", async (req: Request, res: Response) =>
  res.status(OK).json("test")
);

/******************************************************************************
 *                      Creates a finite token for session representation.
 ******************************************************************************/

const createToken = (user: User): TokenData => {
  const expiresIn = 60 * 60; // an hour
  const secret = process.env.JWT_SECRET || "";
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn })
  };
};

/******************************************************************************
 *                      Login - "POST /api/auth/login"
 ******************************************************************************/

router.post("/login", async (req: Request, res: Response) => {
  try {
    const logInData: Login = req.body;
    const user = await User.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = "undefined";
        const tokenData = createToken(user);
        res.send({ ...user, tokenData });
      } else return res.status(UNAUTHORIZED);
    } else return res.status(UNAUTHORIZED);
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

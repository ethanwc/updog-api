import { Request, Response, Router, Express } from "express";
import {
  BAD_REQUEST,
  CREATED,
  OK,
  UNAUTHORIZED,
  CONFLICT
} from "http-status-codes";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { logger } from "@shared";
import User from "../../dto/User";
import Login from "../../dto/Login";
import Register from "../../dto/Register";
import UserModel from "../../dto/UserModel";

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
 *                      Register - "POST /api/auth/register"
 ******************************************************************************/

router.post("/register", async (req: Request, res: Response) => {
  try {
    const userData: Register = req.body;
    if (await User.findOne({ email: userData.email }))
      return res.status(CONFLICT);
    else {
      if (await User.findOne({ username: userData.username }))
        return res.status(CONFLICT);
      else {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
          ...userData,
          password: hashedPassword
        });
        user.password = "undefined";
        const tokenData = createToken(user);
        res.status(CREATED).json({ ...user, tokenData });
      }
    }
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

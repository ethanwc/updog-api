import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import "../interfaces/DataStoredInToken";
import User from "../dto/User";
import UserModel from "../dto/UserModel";
/**
 * Middleware for authorization
 */

interface RequestWitUser extends Request {
  user?: User;
}

interface DataStoredInToken {
  _id: string;
}
// User Model
const User = UserModel;
async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const body = request.body;
  if (body && body.Authentication) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        body.Authentication,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await User.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException("1"));
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException("1"));
    }
  } else {
    console.log(body);
    next(new AuthenticationTokenMissingException("1"));
  }
}

export default authMiddleware;

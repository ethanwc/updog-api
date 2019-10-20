import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/RequestWithUser";
import userModel from "../users/user.model";
import "../interfaces/DataStoredInToken";

/**
 * Middleware for authorization
 */
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
      const user = await userModel.findById(id);
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
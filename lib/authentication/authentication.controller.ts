import * as bcrypt from "bcrypt";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsExpcetion";
import Controller from "../interfaces/controller";
import ValidationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../users/user.dto";
import UserModel from "../users/user.model";
import LogInDto from "./Login.dto";
import User from "users/user.interface";
import "../interfaces/TokenData";

/**
 * Handles login, register, logout for the application.
 */
class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initalizes routes requires middleware.
   */
  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(LogInDto),
      this.loggingIn
    );
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  /**
   * Logs user out by expiring JWT token.
   */
  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };

  /**
   * Creates a finite token for session representation.
   */
  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  /**
   * Registers user if conditions are met.
   */
  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      response.send({ ...user, tokenData });
    }
  };

  /**
   * Login route, authorizes user and generates JWT token for session representation.
   */
  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        response.send({ ...user, tokenData });
      } else {
        next(new WrongCredentialsException("1"));
      }
    } else {
      next(new WrongCredentialsException("1"));
    }
  };

  /**
   * Creates cookie from JWT.
   */
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationController;

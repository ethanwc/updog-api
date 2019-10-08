import { Request } from "express";
import User from "users/user.interface";

interface RequestWitUser extends Request {
  user?: User;
}

export default RequestWitUser;

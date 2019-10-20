import HttpException from "./HttpException";

class UserWithThatUsernameAlreadyExistsException extends HttpException {
  constructor(id: string) {
    super(499, `User already exists`);
  }
}

export default UserWithThatUsernameAlreadyExistsException;

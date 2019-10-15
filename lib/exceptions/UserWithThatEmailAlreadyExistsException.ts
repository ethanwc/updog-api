import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(id: string) {
    super(499, `User already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;

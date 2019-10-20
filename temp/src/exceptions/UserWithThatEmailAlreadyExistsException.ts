import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(id: string) {
    super(499, `Username already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;

import HttpException from "./HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(id: string) {
    super(428, `Post with id ${id} not found`);
  }
}

export default UserWithThatEmailAlreadyExistsException;

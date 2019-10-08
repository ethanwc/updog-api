import HttpException from "./HttpException";

class AuthenticationTokenMissingException extends HttpException {
  constructor(id: string) {
    super(428, `Post with id ${id} not found`);
  }
}

export default AuthenticationTokenMissingException;

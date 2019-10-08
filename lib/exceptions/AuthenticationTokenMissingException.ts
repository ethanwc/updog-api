import HttpException from "./HttpException";

class AuthenticationTokenMissingException extends HttpException {
  constructor(id: string) {
    super(428, `Authentication Token Missing`);
  }
}

export default AuthenticationTokenMissingException;

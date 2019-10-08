import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
  constructor(id: string) {
    super(401, `Invalid Credentials`);
  }
}

export default WrongCredentialsException;

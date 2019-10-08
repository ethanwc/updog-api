import HttpException from "./HttpException";

class WrongAuthenticationTokenException extends HttpException {
  constructor(id: string) {
    super(401, `Post with id ${id} not found`);
  }
}

export default WrongAuthenticationTokenException;

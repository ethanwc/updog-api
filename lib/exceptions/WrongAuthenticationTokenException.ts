import HttpException from "./HttpException";

class WrongAuthenticationTokenException extends HttpException {
  constructor(id: string) {
    super(401, `Wrong Authorization Token`);
  }
}

export default WrongAuthenticationTokenException;

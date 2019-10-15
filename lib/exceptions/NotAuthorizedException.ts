import HttpException from "./HttpException";

class NotAuthorizedException extends HttpException {
  constructor(id: string) {
    super(400, `Not authorized`);
  }
}

export default NotAuthorizedException;

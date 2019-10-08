import HttpException from "./HttpException";

class NotAuthorizedException extends HttpException {
  constructor(id: string) {
    super(404, `Post with id ${id} not found`);
  }
}

export default NotAuthorizedException;

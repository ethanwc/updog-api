import HttpException from "./HttpException";

class FailedFollowingException extends HttpException {
  constructor(id: string) {
    super(418, `Failed to follow, russian bot detected`);
  }
}

export default FailedFollowingException;

import { Router } from "express";

/**
 * Interface for handling routing
 */
interface Controller {
  path: string;
  router: Router;
}

export default Controller;

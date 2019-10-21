import { Router } from "express";
import UserRouter from "./Users/Users";
import PostRouter from "./Posts/Posts";
import AuthenticationRouter from "./Authentication/Authentication";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", UserRouter);
router.use("/posts", PostRouter);
router.use("/auth", AuthenticationRouter);

//todo: Add routes for own posts, users, chat

// Export the base-router
export default router;

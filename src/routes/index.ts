import { Router } from 'express';
import UserRouter from './Users/Users';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
//todo: Add routes for own posts, users, chat

// Export the base-router
export default router;

import { Router } from 'express';
import { signup, signin, googleAuth, changePassword } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.post("/google-auth", authLimiter, googleAuth);
router.post("/change-password", authLimiter, verifyJWT, changePassword);

export default router;

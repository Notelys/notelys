import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import { searchUsers, getProfile, updateProfileImg, updateProfile } from '../controllers/user.controller.js';

const router = Router();

// Public
router.post("/search-users", searchUsers);
router.post("/get-profile", getProfile);

// Protected
router.post("/update-profile-img", verifyJWT, updateProfileImg);
router.post("/update-profile", verifyJWT, updateProfile);

export default router;

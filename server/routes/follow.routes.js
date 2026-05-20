import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.js';
import {
    followUser,
    unfollowUser,
    isFollowing,
    isFollowingBack,
    getFollowers,
    getFollowersCount,
    getFollowing,
    getFollowingCount,
    followFeed,
    followFeedCount
} from '../controllers/follow.controller.js';

const router = Router();

// Public — anyone can view followers/following lists
router.post("/followers", getFollowers);
router.post("/followers-count", getFollowersCount);
router.post("/following", getFollowing);
router.post("/following-count", getFollowingCount);

// Protected — requires authentication
router.post("/follow", verifyJWT, followUser);
router.post("/unfollow", verifyJWT, unfollowUser);
router.post("/is-following", verifyJWT, isFollowing);
router.post("/is-following-back", verifyJWT, isFollowingBack);
router.post("/follow-feed", verifyJWT, followFeed);
router.post("/follow-feed-count", verifyJWT, followFeedCount);

export default router;

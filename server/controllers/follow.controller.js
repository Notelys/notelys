import Follow from '../Schema/Follow.js';
import User from '../Schema/User.js';
import Notification from '../Schema/Notification.js';

/**
 * POST /api/follow
 * Follow a user. One-way, instant, no approval needed.
 */
export const followUser = async (req, res) => {
    try {
        const follower_id = req.user;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (follower_id === user_id) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        // Verify target user exists
        const targetUser = await User.findById(user_id).select("_id");
        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Idempotent: if already following, return success
        const existing = await Follow.findOne({ follower: follower_id, following: user_id });
        if (existing) {
            return res.status(200).json({ followed: true });
        }

        // Create follow relationship
        await new Follow({ follower: follower_id, following: user_id }).save();

        // Update counters atomically
        await Promise.all([
            User.findByIdAndUpdate(follower_id, { $inc: { "account_info.total_following": 1 } }),
            User.findByIdAndUpdate(user_id, { $inc: { "account_info.total_followers": 1 } })
        ]);

        // Create notification (fire-and-forget)
        new Notification({
            type: "follow",
            notification_for: user_id,
            user: follower_id,
        }).save().catch(err => console.error('[Follow] Notification error:', err.message));

        return res.status(200).json({ followed: true });

    } catch (err) {
        // Handle duplicate key error (race condition)
        if (err.code === 11000) {
            return res.status(200).json({ followed: true });
        }
        console.error('[Follow] followUser failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/unfollow
 * Unfollow a user.
 */
export const unfollowUser = async (req, res) => {
    try {
        const follower_id = req.user;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const result = await Follow.findOneAndDelete({ follower: follower_id, following: user_id });

        if (!result) {
            // Already not following — idempotent
            return res.status(200).json({ followed: false });
        }

        // Update counters atomically
        await Promise.all([
            User.findByIdAndUpdate(follower_id, { $inc: { "account_info.total_following": -1 } }),
            User.findByIdAndUpdate(user_id, { $inc: { "account_info.total_followers": -1 } })
        ]);

        // Remove the follow notification
        Notification.findOneAndDelete({ type: "follow", notification_for: user_id, user: follower_id })
            .catch(err => console.error('[Follow] Notification cleanup error:', err.message));

        return res.status(200).json({ followed: false });

    } catch (err) {
        console.error('[Follow] unfollowUser failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/is-following
 * Check if logged-in user follows a target user.
 */
export const isFollowing = async (req, res) => {
    try {
        const follower_id = req.user;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const exists = await Follow.exists({ follower: follower_id, following: user_id });

        return res.status(200).json({ following: !!exists });

    } catch (err) {
        console.error('[Follow] isFollowing failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/followers
 * Get paginated list of a user's followers.
 */
export const getFollowers = async (req, res) => {
    try {
        const { user_id, page = 1 } = req.body;
        const maxLimit = 15;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const followers = await Follow.find({ following: user_id })
            .populate("follower", "personal_info.fullname personal_info.username personal_info.profile_img")
            .sort({ followedAt: -1 })
            .skip((page - 1) * maxLimit)
            .limit(maxLimit)
            .select("follower followedAt");

        const results = followers.map(f => ({
            ...f.follower.toObject(),
            followedAt: f.followedAt
        }));

        return res.status(200).json({ users: results });

    } catch (err) {
        console.error('[Follow] getFollowers failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/followers-count
 * Count a user's followers.
 */
export const getFollowersCount = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const count = await Follow.countDocuments({ following: user_id });
        return res.status(200).json({ totalDocs: count });

    } catch (err) {
        console.error('[Follow] getFollowersCount failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/following
 * Get paginated list of who a user follows.
 */
export const getFollowing = async (req, res) => {
    try {
        const { user_id, page = 1 } = req.body;
        const maxLimit = 15;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const following = await Follow.find({ follower: user_id })
            .populate("following", "personal_info.fullname personal_info.username personal_info.profile_img")
            .sort({ followedAt: -1 })
            .skip((page - 1) * maxLimit)
            .limit(maxLimit)
            .select("following followedAt");

        const results = following.map(f => ({
            ...f.following.toObject(),
            followedAt: f.followedAt
        }));

        return res.status(200).json({ users: results });

    } catch (err) {
        console.error('[Follow] getFollowing failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/following-count
 * Count how many users someone follows.
 */
export const getFollowingCount = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const count = await Follow.countDocuments({ follower: user_id });
        return res.status(200).json({ totalDocs: count });

    } catch (err) {
        console.error('[Follow] getFollowingCount failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/follow-feed
 * Get blogs from users the logged-in user follows (personalized feed).
 */
export const followFeed = async (req, res) => {
    try {
        const user_id = req.user;
        const { page = 1 } = req.body;
        const maxLimit = 5;

        // Get all user IDs this person follows
        const followDocs = await Follow.find({ follower: user_id }).select("following").lean();
        const followingIds = followDocs.map(f => f.following);

        if (followingIds.length === 0) {
            return res.status(200).json({ blogs: [] });
        }

        // Import Blog dynamically to avoid circular deps (it's already cached by mongoose)
        const Blog = (await import('../Schema/Blog.js')).default;

        const blogs = await Blog.find({ author: { $in: followingIds }, draft: false })
            .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags readTime publishedAt")
            .skip((page - 1) * maxLimit)
            .limit(maxLimit);

        return res.status(200).json({ blogs });

    } catch (err) {
        console.error('[Follow] followFeed failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/follow-feed-count
 * Count total blogs in the follow feed.
 */
export const followFeedCount = async (req, res) => {
    try {
        const user_id = req.user;

        const followDocs = await Follow.find({ follower: user_id }).select("following").lean();
        const followingIds = followDocs.map(f => f.following);

        if (followingIds.length === 0) {
            return res.status(200).json({ totalDocs: 0 });
        }

        const Blog = (await import('../Schema/Blog.js')).default;
        const count = await Blog.countDocuments({ author: { $in: followingIds }, draft: false });

        return res.status(200).json({ totalDocs: count });

    } catch (err) {
        console.error('[Follow] followFeedCount failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/is-following-back
 * Check if a target user follows the logged-in user back (for "Follows you" badge).
 */
export const isFollowingBack = async (req, res) => {
    try {
        const current_user_id = req.user;
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const exists = await Follow.exists({ follower: user_id, following: current_user_id });

        return res.status(200).json({ follows_you: !!exists });

    } catch (err) {
        console.error('[Follow] isFollowingBack failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
};

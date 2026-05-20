import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import api from "../common/api";
import { useNavigate } from "react-router-dom";

/**
 * FollowButton — handles follow/unfollow toggle with optimistic UI.
 * 
 * Props:
 *   targetUserId  — the _id of the user to follow/unfollow
 *   initiallyFollowing — optional boolean if already known
 *   onFollowChange — optional callback(isFollowing) after state changes
 *   size — "sm" | "md" (default "md")
 *   className — additional CSS classes
 */
const FollowButton = ({ targetUserId, initiallyFollowing = null, onFollowChange, size = "md", className = "" }) => {

    const { userAuth: { access_token, _id: currentUserId } } = useContext(UserContext);
    const navigate = useNavigate();

    const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Don't render if viewing own profile
    if (currentUserId === targetUserId) return null;

    // Fetch initial follow state if not provided
    useEffect(() => {
        if (initiallyFollowing !== null || !access_token || !targetUserId) return;

        api.post("/is-following", { user_id: targetUserId })
            .then(({ data }) => setIsFollowing(data.following))
            .catch(() => setIsFollowing(false));
    }, [targetUserId, access_token]);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!access_token) {
            navigate("/signin");
            return;
        }

        if (loading) return;

        setLoading(true);

        // Optimistic update
        const newState = !isFollowing;
        setIsFollowing(newState);

        try {
            const endpoint = newState ? "/follow" : "/unfollow";
            await api.post(endpoint, { user_id: targetUserId });
            onFollowChange?.(newState);
        } catch (err) {
            // Revert on failure
            setIsFollowing(!newState);
        } finally {
            setLoading(false);
        }
    };

    // Don't render until we know the state
    if (isFollowing === null) return null;

    const sizeClasses = size === "sm" 
        ? "follow-btn--sm" 
        : "follow-btn--md";

    const stateClass = isFollowing 
        ? (hovered ? "follow-btn--unfollow" : "follow-btn--following")
        : "follow-btn--follow";

    const label = isFollowing 
        ? (hovered ? "Unfollow" : "Following") 
        : "Follow";

    return (
        <button
            className={`follow-btn ${sizeClasses} ${stateClass} ${className}`}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            disabled={loading}
            aria-label={label}
        >
            {label}
        </button>
    );
};

export default FollowButton;

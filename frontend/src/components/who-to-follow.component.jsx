import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../common/api";
import { UserContext } from "../App";
import Avatar from "./Avatar";
import FollowButton from "./follow-button.component";

const WhoToFollow = () => {

    const [users, setUsers] = useState(null);
    const { userAuth: { username: currentUser, access_token } } = useContext(UserContext);

    useEffect(() => {
        api.post("/search-users", { query: "" })
            .then(({ data }) => {
                let filtered = data.users
                    .filter(u => u.personal_info.username !== currentUser)
                    .slice(0, 4);
                setUsers(filtered);
            })
            .catch(() => setUsers([]));
    }, [currentUser]);

    if (!users || users.length === 0) return null;

    return (
        <div className="home-sidebar__section">
            <div className="home-sidebar__header">
                <div className="home-sidebar__title">
                    Who to follow
                </div>
                <span className="home-sidebar__view-all">View all</span>
            </div>

            <div className="who-to-follow__list">
                {users.map((user, i) => {
                    const { fullname, username, profile_img } = user.personal_info;
                    return (
                        <div key={i} className="who-to-follow__item">
                            <Link to={`/user/${username}`} className="who-to-follow__user">
                                <Avatar src={profile_img} alt={fullname} size={36} />
                                <div className="who-to-follow__info">
                                    <span className="who-to-follow__name">{fullname}</span>
                                    <span className="who-to-follow__handle">@{username}</span>
                                </div>
                            </Link>
                            {access_token ? (
                                <FollowButton
                                    targetUserId={user._id}
                                    size="sm"
                                />
                            ) : (
                                <Link
                                    to="/signin"
                                    className="who-to-follow__follow-btn"
                                >
                                    Follow
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WhoToFollow;

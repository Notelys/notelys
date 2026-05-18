import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { UserContext } from "../App";
import Icon from "./Icon";

const BottomTabBar = () => {

    const { userAuth: { access_token, new_notification_available } } = useContext(UserContext);

    return (
        <nav className="bottom-tab-bar">
            <NavLink to="/" end className={({ isActive }) => "bottom-tab-bar__item" + (isActive ? " active" : "")}>
                <Icon name="home" className="text-2xl" />
                <span>Home</span>
            </NavLink>

            <NavLink to="/search/" className={({ isActive }) => "bottom-tab-bar__item" + (isActive ? " active" : "")}>
                <Icon name="explore" className="text-2xl" />
                <span>Explore</span>
            </NavLink>

            <Link to={access_token ? "/editor" : "/signin"} className="bottom-tab-bar__create">
                <Icon name="add" className="text-2xl" />
            </Link>

            {access_token ? (
                <NavLink to="/dashboard/notifications" className={({ isActive }) => "bottom-tab-bar__item" + (isActive ? " active" : "")}>
                    <div className="relative">
                        <Icon name="notifications" className="text-2xl" />
                        {new_notification_available && (
                            <span className="notification-badge !w-1.5 !h-1.5 !top-0 !right-0"></span>
                        )}
                    </div>
                    <span>Activity</span>
                </NavLink>
            ) : (
                <NavLink to="/signin" className={({ isActive }) => "bottom-tab-bar__item" + (isActive ? " active" : "")}>
                    <Icon name="notifications" className="text-2xl" />
                    <span>Activity</span>
                </NavLink>
            )}

            {access_token ? (
                <NavLink to="/settings/edit-profile" className={({ isActive }) => "bottom-tab-bar__item" + (isActive ? " active" : "")}>
                    <Icon name="person" className="text-2xl" />
                    <span>Profile</span>
                </NavLink>
            ) : (
                <NavLink to="/signin" className={({ isActive }) => "bottom-tab-bar__item" + (isActive ? " active" : "")}>
                    <Icon name="person" className="text-2xl" />
                    <span>Profile</span>
                </NavLink>
            )}
        </nav>
    );
};

export default BottomTabBar;

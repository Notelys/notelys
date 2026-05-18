import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { ThemeContext, UserContext } from "../App";
import { storeInSession } from "../common/session";
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import Icon from "./Icon";
import KeepReading from "./keep-reading.component";

const navItems = [
    { to: "/", icon: "home", label: "Home", end: true },
    { to: "/search/", icon: "explore", label: "Explore" },
    { to: "/dashboard/notifications", icon: "notifications", label: "Activity", authOnly: true },
    { to: "/settings/edit-profile", icon: "person", label: "Profile", authOnly: true },
    { to: "/dashboard/blogs", icon: "draft", label: "Drafts", authOnly: true },
];

const LeftSidebar = () => {

    const { userAuth: { access_token, profile_img, username, new_notification_available } } = useContext(UserContext);
    const { theme, setTheme } = useContext(ThemeContext);

    const changeTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        if (newTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        setTheme(newTheme);
        storeInSession("theme", newTheme);
    };

    return (
        <aside className="left-sidebar">
            {/* Logo */}
            <Link to="/" className="left-sidebar__logo">
                <img
                    src={theme === "light" ? darkLogo : lightLogo}
                    alt="Kalamio logo"
                />
                <span className="left-sidebar__logo-text">Kalamio</span>
            </Link>

            {/* Navigation */}
            <nav className="left-sidebar__nav">
                {navItems.map(({ to, icon, label, end, authOnly }) => {
                    if (authOnly && !access_token) return null;

                    return (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                "left-sidebar__link" + (isActive ? " active" : "")
                            }
                        >
                            <div className="relative">
                                <Icon name={icon} className="text-[22px]" />
                                {icon === "notifications" && new_notification_available && (
                                    <span className="notification-badge !w-2 !h-2 !top-0 !right-0"></span>
                                )}
                            </div>
                            <span>{label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Write Button */}
            {access_token ? (
                <Link to="/editor" className="left-sidebar__write-btn">
                    <Icon name="add" className="text-xl" />
                    <span>Create Post</span>
                </Link>
            ) : (
                <Link to="/signin" className="left-sidebar__write-btn">
                    <span>Sign In</span>
                </Link>
            )}

            {/* Keep Reading */}
            <KeepReading />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer + copyright (logged out only) */}
            {!access_token && (
                <div className="left-sidebar__footer">
                    <p className="left-sidebar__copyright">© 2026 Kalamio</p>
                    <div className="left-sidebar__footer-links">
                        <a href="#">About</a>
                        <a href="#">Help</a>
                        <a href="#">Terms</a>
                        <a href="#">Privacy</a>
                    </div>
                </div>
            )}

            {/* Theme toggle */}
            <div className="left-sidebar__bottom">
                <button
                    className="left-sidebar__link"
                    onClick={changeTheme}
                    aria-label="Toggle theme"
                >
                    <Icon name={theme === "light" ? "dark_mode" : "light_mode"} className="text-[22px]" />
                    <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;

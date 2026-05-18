import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext, UserContext } from "../App";
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import Icon from "./Icon";

const MobileTopBar = () => {

    const { userAuth: { access_token, new_notification_available } } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        let query = e.target.value;
        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
            setSearchOpen(false);
        }
    };

    return (
        <header className="mobile-top-bar">
            {searchOpen ? (
                <div className="mobile-top-bar__search">
                    <Icon name="search" className="text-xl text-dark-grey" />
                    <input
                        type="text"
                        placeholder="Search blogs, topics or writers..."
                        className="mobile-top-bar__search-input"
                        onKeyDown={handleSearch}
                        autoFocus
                    />
                    <button onClick={() => setSearchOpen(false)} className="p-1">
                        <Icon name="close" className="text-xl text-dark-grey" />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        className="mobile-top-bar__icon-btn"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Icon name="search" className="text-xl" />
                    </button>

                    <Link to="/" className="mobile-top-bar__logo">
                        <img
                            src={theme === "light" ? darkLogo : lightLogo}
                            alt="Notelys logo"
                        />
                    </Link>

                    <Link
                        to={access_token ? "/dashboard/notifications" : "/signin"}
                        className="mobile-top-bar__icon-btn relative"
                    >
                        <Icon name="notifications" className="text-xl" />
                        {access_token && new_notification_available && (
                            <span className="notification-badge !w-2 !h-2"></span>
                        )}
                    </Link>
                </>
            )}
        </header>
    );
};

export default MobileTopBar;

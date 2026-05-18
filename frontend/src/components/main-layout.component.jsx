import { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext, UserContext } from "../App";
import LeftSidebar from "./left-sidebar.component";
import BottomTabBar from "./bottom-tab-bar.component";
import MobileTopBar from "./mobile-top-bar.component";
import UserNavigationPanel from "./user-navigation.component";
import Icon from "./Icon";
import api from "../common/api";
import { useEffect } from "react";

const MainLayout = () => {

    const { userAuth: { access_token, profile_img }, setUserAuth } = useContext(UserContext);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const navigate = useNavigate();

    // Check for new notifications
    useEffect(() => {
        if (access_token) {
            api.get("/new-notification")
                .then(({ data }) => {
                    setUserAuth(prev => ({ ...prev, ...data }));
                })
                .catch(() => {});
        }
    }, [access_token]);

    const handleSearch = (e) => {
        let query = e.target.value;
        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 300);
    };

    return (
        <div className="app-layout">
            {/* Desktop left sidebar — hidden on mobile */}
            <LeftSidebar />

            {/* Mobile top bar — hidden on desktop */}
            <MobileTopBar />

            {/* Main content area */}
            <main className="app-layout__main">
                {/* Desktop top bar (search + user avatar) */}
                <div className="desktop-top-bar">
                    <div className="desktop-top-bar__search">
                        <Icon name="search" className="text-xl text-dark-grey" />
                        <input
                            type="text"
                            placeholder="Search blogs, topics or writers..."
                            className="desktop-top-bar__search-input"
                            onKeyDown={handleSearch}
                        />
                        <div className="desktop-top-bar__shortcut">
                            <kbd>⌘</kbd><kbd>K</kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto flex-none">
                        {access_token ? (
                            <div className="relative" onClick={() => setUserNavPanel(v => !v)} onBlur={handleBlur}>
                                <button className="w-9 h-9">
                                    <img
                                        src={profile_img}
                                        className="w-full h-full object-cover rounded-full border border-border hover:border-dark-grey transition-colors"
                                        alt="Profile"
                                    />
                                </button>
                                {userNavPanel && <UserNavigationPanel />}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <a href="/signin" className="btn-dark py-2 text-sm">Sign In</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page content */}
                <div className="app-layout__content">
                    <Outlet />
                </div>
            </main>

            {/* Mobile bottom tab bar — hidden on desktop */}
            <BottomTabBar />
        </div>
    );
};

export default MainLayout;

import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/main-layout.component";
import { createContext, useEffect, useState, lazy, Suspense } from "react";
import { lookInSession } from "./common/session";
import { Toaster } from 'react-hot-toast';
import Loader from "./components/loader.component";

// Lazy load all pages — only downloaded when the user navigates to them
const UserAuthForm = lazy(() => import("./pages/userAuthForm.page"));
const Editor = lazy(() => import("./pages/editor.pages"));
const HomePage = lazy(() => import("./pages/home.page"));
const SearchPage = lazy(() => import("./pages/search.page"));
const PageNotFound = lazy(() => import("./pages/404.page"));
const ProfilePage = lazy(() => import("./pages/profile.page"));
const BlogPage = lazy(() => import("./pages/blog.page"));
const SideNav = lazy(() => import("./components/sidenavbar.component"));
const ChangePassword = lazy(() => import("./pages/change-password.page"));
const EditProfile = lazy(() => import("./pages/edit-profile.page"));
const Notifications = lazy(() => import("./pages/notifications.page"));
const ManageBlogs = lazy(() => import("./pages/manage-blogs.page"));
const AuthCallback = lazy(() => import("./pages/auth-callback.page"));
const VerifyOtp = lazy(() => import("./pages/verify-otp.page"));
const ForgotPassword = lazy(() => import("./pages/forgot-password.page"));
const ResetPassword = lazy(() => import("./pages/reset-password.page"));

export const UserContext = createContext({});
export const ThemeContext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({});
    const [theme, setTheme] = useState("dark");

    useEffect(() => {

        let userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

        // Restore saved theme (dark = default/no attr, light = explicit)
        let savedTheme = lookInSession("theme") || "dark";
        document.documentElement.classList.add("no-transition");
        if (savedTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        setTheme(savedTheme);

        // Re-enable transitions after first paint
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove("no-transition");
            });
        });

    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <UserContext.Provider value={{userAuth, setUserAuth}}>
                <Toaster 
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: theme === 'dark' ? '#2d2d2c' : '#fff',
                            color: theme === 'dark' ? '#f5f5f5' : '#0f0f0f',
                            border: `1px solid ${theme === 'dark' ? '#373735' : '#e6e6e6'}`,
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: theme === 'dark' 
                                ? '0 10px 20px rgba(0,0,0,0.4)' 
                                : '0 10px 20px rgba(0,0,0,0.08)',
                        },
                    }}
                />
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path="/editor" element={<Editor/>} />
                        <Route path="/editor/:blog_id" element={<Editor/>} />
                        <Route path="/" element={<MainLayout />} >
                            <Route index element={<HomePage />} />
                            <Route path="dashboard" element={<SideNav />} >
                                <Route path="blogs" element={<ManageBlogs />} />
                                <Route path="notifications" element={<Notifications />} />
                            </Route>
                            <Route path="settings" element={<SideNav />} >
                                <Route path="edit-profile" element={<EditProfile />} />
                                <Route path="change-password" element={<ChangePassword />} />
                            </Route>
                            <Route path="signin" element={<UserAuthForm type="sign-in"/>} />
                            <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                            <Route path="verify-otp" element={<VerifyOtp />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="reset-password" element={<ResetPassword />} />
                            <Route path="search/:query" element={<SearchPage />} />
                            <Route path="user/:id" element={<ProfilePage />} />
                            <Route path="blog/:blog_id" element={<BlogPage />} />
                            <Route path="auth/callback" element={<AuthCallback />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                        
                    </Routes>
                </Suspense>
            </UserContext.Provider>
        </ThemeContext.Provider>
    )
}

export default App;
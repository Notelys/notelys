import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../App";
import { storeInSession } from "../common/session";
import { toast } from "react-hot-toast";
import Loader from "../components/loader.component";

/**
 * Google OAuth Callback Page.
 *
 * After Google authenticates the user, the backend redirects here with
 * tokens and user data in the URL query parameters.
 *
 * This page:
 * 1. Extracts tokens from URL params
 * 2. Stores them in localStorage
 * 3. Updates the auth context
 * 4. Redirects to the home page
 */
const AuthCallback = () => {
    const { setUserAuth } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const error = searchParams.get("error");

        if (error) {
            toast.error(decodeURIComponent(error));
            navigate("/signin", { replace: true });
            return;
        }

        const access_token = searchParams.get("access_token");
        const refresh_token = searchParams.get("refresh_token");
        const profile_img = searchParams.get("profile_img");
        const username = searchParams.get("username");
        const fullname = searchParams.get("fullname");

        if (!access_token) {
            toast.error("Authentication failed. Please try again.");
            navigate("/signin", { replace: true });
            return;
        }

        const userData = {
            access_token,
            refresh_token,
            profile_img,
            username,
            fullname,
        };

        // Store in localStorage and update context
        storeInSession("user", JSON.stringify(userData));
        setUserAuth(userData);

        // Navigate to home
        navigate("/", { replace: true });

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <Loader />;
};

export default AuthCallback;

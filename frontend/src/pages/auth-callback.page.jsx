import { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../App";
import { storeInSession } from "../common/session";
import { toast } from "react-hot-toast";
import api from "../common/api";
import Loader from "../components/loader.component";

/**
 * Google OAuth Callback Page.
 *
 * After Google authenticates the user, the backend redirects here with
 * a short-lived, single-use authorization code in the URL.
 *
 * This page:
 * 1. Extracts the code from the URL
 * 2. Exchanges it for tokens via a secure POST request
 * 3. Stores the tokens in localStorage
 * 4. Updates the auth context
 * 5. Redirects to the home page
 *
 * Note: A ref guard prevents the exchange from firing twice under
 * React 18 StrictMode (which replays effects in development).
 */
const AuthCallback = () => {
    const { setUserAuth } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const exchangedRef = useRef(false);

    useEffect(() => {
        // Guard: prevent StrictMode double-fire from consuming the one-time code twice
        if (exchangedRef.current) return;
        exchangedRef.current = true;

        const error = searchParams.get("error");

        if (error) {
            toast.error(decodeURIComponent(error));
            navigate("/signin", { replace: true });
            return;
        }

        const code = searchParams.get("code");

        if (!code) {
            toast.error("Authentication failed. Please try again.");
            navigate("/signin", { replace: true });
            return;
        }

        // Exchange the authorization code for tokens via a secure POST request
        api.post("/exchange-auth-code", { code })
            .then(({ data }) => {
                // Store in localStorage and update context
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);

                // Navigate to home
                navigate("/", { replace: true });
            })
            .catch(({ response }) => {
                toast.error(response?.data?.error || "Authentication failed. Please try again.");
                navigate("/signin", { replace: true });
            });

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <Loader />;
};

export default AuthCallback;


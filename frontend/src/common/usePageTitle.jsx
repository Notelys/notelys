import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PRODUCTION_ORIGIN = "https://notelys.org";

const usePageTitle = (title) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const baseTitle = "Notelys";
        document.title = title ? (title === baseTitle ? baseTitle : `${title} — ${baseTitle}`) : baseTitle;

        // Update canonical URL to always point to production domain + current path
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", PRODUCTION_ORIGIN + pathname);

        // Reset on unmount
        return () => {
            document.title = baseTitle;
        };
    }, [title, pathname]);
};

export default usePageTitle;

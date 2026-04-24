import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        const baseTitle = "Notelys";
        document.title = title ? (title === baseTitle ? baseTitle : `${title} — ${baseTitle}`) : baseTitle;

        // Reset to base title on unmount
        return () => {
            document.title = baseTitle;
        };
    }, [title]);
};

export default usePageTitle;

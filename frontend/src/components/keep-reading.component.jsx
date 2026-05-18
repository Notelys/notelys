import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

const STORAGE_KEY = "notelys_keep_reading";

// Call this from blog.page.jsx to save reading progress
export const saveReadingProgress = (blog) => {
    if (!blog || !blog.blog_id) return;

    const data = {
        blog_id: blog.blog_id,
        title: blog.title,
        banner: blog.banner || "",
        author: blog.author?.personal_info?.fullname || "",
        savedAt: Date.now(),
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        // localStorage full or unavailable
    }
};

const KeepReading = () => {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                // Only show if saved within last 7 days
                const sevenDays = 7 * 24 * 60 * 60 * 1000;
                if (Date.now() - data.savedAt < sevenDays) {
                    setArticle(data);
                }
            }
        } catch (e) {
            // ignore
        }
    }, []);

    if (!article) return null;

    return (
        <div className="keep-reading">
            <p className="keep-reading__label">
                <Icon name="auto_stories" className="text-base" />
                Keep reading
            </p>
            <Link to={`/blog/${article.blog_id}`} className="keep-reading__card">
                {article.banner && (
                    <div className="keep-reading__thumb">
                        <img src={article.banner} alt={article.title} />
                    </div>
                )}
                <div className="keep-reading__info">
                    <span className="keep-reading__title">{article.title}</span>
                    <span className="keep-reading__meta">{article.author}</span>
                </div>
            </Link>
        </div>
    );
};

export default KeepReading;

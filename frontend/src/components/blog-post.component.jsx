import { Link } from "react-router-dom";
import { getRelativeTime } from "../common/date";
import Icon from "./Icon";

const BlogPostCard = ({ content, author, isLiked = false }) => {

   let { publishedAt, tags, title, des, banner, activity: { total_likes, total_comments }, blog_id: id, readTime } = content;

   let { fullname, profile_img, username } = author;

   const displayReadTime = readTime || 1;

   const formatCount = (n) => {
       if (n >= 1000) return (n / 1000).toFixed(1) + "K";
       return n;
   };
    
    return(
        <div className="feed-card">

            {/* ── Author Row ── */}
            <div className="feed-card__header">
                <Link to={`/user/${username}`} className="feed-card__author">
                    <img src={profile_img} className="feed-card__avatar" alt={fullname}/>
                    <div className="feed-card__author-info">
                        <span className="feed-card__author-name">{fullname}</span>
                        <span className="feed-card__meta">{displayReadTime} min read · {getRelativeTime(publishedAt)}</span>
                    </div>
                </Link>
                <button className="feed-card__menu" aria-label="More options">
                    <Icon name="more_horiz" />
                </button>
            </div>

            {/* ── Content: Title + Description + Tags (left) | Thumbnail (right) ── */}
            <Link to={`/blog/${id}`} className="feed-card__body">
                <div className="feed-card__text">
                    <div className="feed-card__title">{title}</div>
                    <p className="feed-card__description">{des}</p>

                    {/* Tags inside text column */}
                    {tags && tags.length > 0 && (
                        <div className="feed-card__tags" onClick={(e) => e.preventDefault()}>
                            {tags.slice(0, 3).map((tag, i) => (
                                <Link key={i} to={`/search/${tag}`} className="feed-card__tag">#{tag}</Link>
                            ))}
                        </div>
                    )}
                </div>

                {banner && (
                    <div className="feed-card__thumbnail">
                        <img src={banner} alt={title}/>
                    </div>
                )}
            </Link>

            {/* ── Action Bar ── */}
            <div className="feed-card__actions">
                <span className={`feed-card__action${isLiked ? " feed-card__action--like" : ""}`}>
                    <Icon name={isLiked ? "favorite" : "favorite_border"} />
                    <span>{total_likes > 0 ? formatCount(total_likes) : "0"}</span>
                </span>
                <span className="feed-card__action">
                    <Icon name="chat_bubble_outline" />
                    <span>{total_comments > 0 ? total_comments : "0"}</span>
                </span>
                <span className="feed-card__action">
                    <Icon name="bookmark_border" />
                    <span>Save</span>
                </span>
                <span className="feed-card__action feed-card__action--share">
                    <Icon name="ios_share" />
                    <span>Share</span>
                </span>
            </div>
        </div>
    )
}

export default BlogPostCard;
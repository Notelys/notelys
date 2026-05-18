import { Link } from "react-router-dom";

const MinimalBlogPost = ({ blog, index }) => {
    
    let { title, blog_id: id, banner, author: { personal_info: { fullname } }, activity, readTime } = blog;
    const readCount = activity?.total_reads || 0;
    const displayReadTime = readTime || 1;

    const formatCount = (n) => {
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return n;
    };

    return(
        <Link to={`/blog/${id}`} className="trending-item group">
            <span className="trending-item__rank">{index + 1}</span>
            
            {banner && (
                <div className="trending-item__thumb">
                    <img src={banner} alt={title} />
                </div>
            )}

            <div className="trending-item__content">
                <div className="trending-item__title">{title}</div>
                <span className="trending-item__meta">
                    {displayReadTime} min read · {readCount > 0 ? formatCount(readCount) + " reads" : fullname}
                </span>
            </div>
        </Link>
    )
}

export default MinimalBlogPost;
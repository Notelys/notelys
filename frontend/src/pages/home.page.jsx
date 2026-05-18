import api from "../common/api";
import usePageTitle from "../common/usePageTitle";
import Icon from "../components/Icon";
import AnimationWrapper from "../common/page-animation";
import { useContext, useEffect, useState, useRef } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
import WhoToFollow from "../components/who-to-follow.component";
import { UserContext } from "../App";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let [likedBlogs, setLikedBlogs] = useState([]);
  let [trendingFilter, setTrendingFilter] = useState("all");

  let { userAuth: { access_token } } = useContext(UserContext);

  usePageTitle(pageState === "home" ? "Notelys" : `#${pageState}`);

  let categories = [
    "For You",
    "Following",
    "Trending",
    "AI",
    "Money",
    "Self Growth",
    "Productivity",
    "Technology",
    "Life",
    "Fitness",
  ];

  const tabsRef = useRef(null);

  const fetchLatestBlogs = ({page = 1}) => {
    api
      .post("/latest-blogs", { page })
      .then( async ({ data }) => {

        let formatedData = await filterPaginationData({
            state: blogs,
            data: data.blogs,
            page,
            countRoute: "/all-latest-blogs-count"
        })

        setBlogs(formatedData);
      })
      .catch((err) => {
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    api
      .post("/search-blogs", { tag: pageState, page })
      .then( async ({ data }) => {

       let formatedData = await filterPaginationData({
            state: blogs,
            data: data.blogs,
            page,
            countRoute: "/search-blogs-count",
            data_to_send: { tag: pageState }
        })

        setBlogs(formatedData);
      })
      .catch((err) => {
      });
  };

  const fetchTrendingBlogs = () => {
    api
      .get("/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
      });
  };

  const loadBlogByCategory = (category) => {
    setBlogs(null);

    if (category === "For You") {
      if (pageState !== "home") {
        setPageState("home");
      } else {
        fetchLatestBlogs({ page: 1 });
      }
      return;
    }

    if (category === "Trending") {
      setPageState("trending");
      return;
    }

    if (category === "Following") {
      setPageState("following");
      return;
    }

    let tag = category.toLowerCase();
    if (pageState === tag) {
      setPageState("home");
      return;
    }

    setPageState(tag);
  };

  useEffect(() => {
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else if (pageState === "following" || pageState === "trending") {
      // handled separately
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  // Fetch liked status for visible blogs
  useEffect(() => {
    if (blogs?.results?.length && access_token) {
      let blogIds = blogs.results.map(b => b._id).filter(Boolean);
      if (blogIds.length) {
        api.post("/batch-isliked", { blog_ids: blogIds })
          .then(({ data }) => setLikedBlogs(data.likedBlogs || []))
          .catch(() => {});
      }
    } else {
      setLikedBlogs([]);
    }
  }, [blogs, access_token]);

  return (
    <AnimationWrapper>
      <div className="home-layout">

        {/* ── Main Feed Column ──────────────────── */}
        <div className="home-feed">

          {/* Category tabs */}
          <div className="category-tabs" ref={tabsRef}>
            {categories.map((category, i) => {
              const isActive = 
                (category === "For You" && pageState === "home") ||
                (category === "Following" && pageState === "following") ||
                (category === "Trending" && pageState === "trending") ||
                (category !== "For You" && category !== "Following" && category !== "Trending" && pageState === category.toLowerCase());

              return (
                <button
                  key={i}
                  onClick={() => loadBlogByCategory(category)}
                  className={"category-tabs__item" + (isActive ? " active" : "")}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Blog feed */}
          <div className="home-feed__list">
            {pageState === "following" ? (
              <NoDataMessage message="Follow writers to see their blogs here" />
            ) : pageState === "trending" ? (
              <>
                <div className="trending-subtabs">
                  {[{key:"today",label:"Today"},{key:"week",label:"This Week"},{key:"month",label:"This Month"},{key:"all",label:"All Time"}].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setTrendingFilter(tab.key)}
                      className={"trending-subtabs__item" + (trendingFilter === tab.key ? " active" : "")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {trendingBlogs == null ? <Loader /> :
                  (() => {
                    const now = new Date();
                    const filtered = trendingBlogs.filter(b => {
                      if (trendingFilter === "all") return true;
                      const published = new Date(b.publishedAt);
                      const diffDays = (now - published) / (1000 * 60 * 60 * 24);
                      if (trendingFilter === "today") return diffDays <= 1;
                      if (trendingFilter === "week") return diffDays <= 7;
                      if (trendingFilter === "month") return diffDays <= 30;
                      return true;
                    });
                    return filtered.length ?
                      filtered.map((blog, i) => (
                        <AnimationWrapper key={blog.blog_id} transition={{ duration: 0.4, delay: i * 0.04 }}>
                          <BlogPostCard
                            content={blog}
                            author={blog.author.personal_info}
                            isLiked={likedBlogs.includes(blog._id)}
                          />
                        </AnimationWrapper>
                      ))
                    : <NoDataMessage message="No trending blogs for this period" />
                  })()}
              </>
            ) : blogs == null ? (
              <Loader />
            ) : (
              blogs.results.length ?
                  blogs.results.map((blog, i) => {
                  return (
                      <AnimationWrapper
                      key={blog.blog_id}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      >
                      <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                          isLiked={likedBlogs.includes(blog._id)}
                      />
                      </AnimationWrapper>
                  );
                  })
              : <NoDataMessage message="No blogs published"/>
            )}
            {pageState !== "following" && pageState !== "trending" && <LoadMoreDataBtn state={blogs} fetchDataFun={( pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory )} />}
          </div>
        </div>

        {/* ── Right Sidebar Column (Desktop) ───── */}
        <aside className="home-sidebar">
          {/* Trending Now */}
          <div className="home-sidebar__section">
            <div className="home-sidebar__header">
              <div className="home-sidebar__title">
                🔥 Trending Now
              </div>
              <span className="home-sidebar__view-all">View all</span>
            </div>

            <div className="home-sidebar__list">
              {trendingBlogs == null ? (
                <Loader />
              ) : (
                trendingBlogs.length ?
                    trendingBlogs.slice(0, 5).map((blog, i) => {
                    return (
                        <AnimationWrapper
                        key={blog.blog_id}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                        <MinimalBlogPost blog={blog} index={i} />
                        </AnimationWrapper>
                    );
                    })
                : <NoDataMessage message="No trending blogs"/>
              )}
            </div>
          </div>

          {/* Who to Follow */}
          <WhoToFollow />

          {/* Footer links */}
          <div className="home-sidebar__footer">
            <a href="#" className="home-sidebar__footer-link">About</a>
            <a href="#" className="home-sidebar__footer-link">Help</a>
            <a href="#" className="home-sidebar__footer-link">Terms</a>
            <a href="#" className="home-sidebar__footer-link">Privacy</a>
            <p className="home-sidebar__copyright">© 2026 Kalamio</p>
          </div>
        </aside>

      </div>
    </AnimationWrapper>
  );
};

export default HomePage;

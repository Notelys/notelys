import api from "../common/api";
import usePageTitle from "../common/usePageTitle";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import InPageNavigation from "../components/inpage-navigation.component";
import PageNotFound from "./404.page";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import FollowButton from "../components/follow-button.component";

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "" 
    },
    account_info: {
        total_posts: 0,
        total_reads: 0,
        total_followers: 0,
        total_following: 0,
    },
    social_links: {},
    joinedAt: ""
}

const ProfilePage = () => {

    let { id: profileId } = useParams();

    let [ profile, setProfile ] = useState(profileDataStructure);
    let [ loading, setLoading ] = useState(true);
    let [ blogs, setBlogs ] = useState(null);
    let [ profileLoaded, setProfileLoaded ] = useState("");
    let [ followsYou, setFollowsYou ] = useState(false);

    let { 
        personal_info: { fullname, username: profile_username, profile_img, bio }, 
        account_info: { total_posts, total_reads, total_followers, total_following },
        social_links, joinedAt, _id: profileUserId
        } = profile;

    usePageTitle(profile_username ? `@${profile_username}` : 'Profile');

    let { userAuth: { username, access_token } } = useContext(UserContext);

    const fetchUserProfile = () => {
        api.post("/get-profile", {username: profileId})
        .then(({ data: user }) => {
            if(user != null){
                setProfile(user);

                // Check if this user follows you back (for badge)
                if (access_token && username && user.personal_info.username !== username) {
                    api.post("/is-following-back", { user_id: user._id })
                        .then(({ data }) => setFollowsYou(data.follows_you))
                        .catch(() => {});
                }
            }
            setProfileLoaded(profileId);
            getBlogs({ user_id: user._id });
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
        })

    }

    const getBlogs = ({ page = 1, user_id }) => {

        user_id = user_id == undefined ? blogs.user_id : user_id;

        api.post("/search-blogs", {
            author: user_id,
            page
        })
        .then(async ({ data }) => {

            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { author: user_id }
            })

            formatedData.user_id = user_id;

            setBlogs(formatedData);

        })

    }

    useEffect(() => {

        if(profileId != profileLoaded){
            setBlogs(null);
        }
        if(blogs == null){
            resetState();
            fetchUserProfile();
        }

    }, [profileId, blogs])

    const resetState = () => {
        setProfile(profileDataStructure);
        setLoading(true);
        setProfileLoaded("");
        setFollowsYou(false);
    }

    // Track follower count locally for instant UI update
    const [localFollowers, setLocalFollowers] = useState(null);
    useEffect(() => {
        setLocalFollowers(total_followers);
    }, [total_followers]);

    const handleFollowChange = (isNowFollowing) => {
        setLocalFollowers(prev => prev + (isNowFollowing ? 1 : -1));
    };

    const displayFollowers = localFollowers ?? total_followers;

    return (
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : (
            profile_username.length ? 
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-border md:sticky md:top-[100px] md:py-10 ">
                    
                    {/* Avatar with gradient ring */}
                    <div className="relative">
                        <div className="w-48 h-48 md:w-32 md:h-32 rounded-full p-[3px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(var(--c-brand)), rgb(var(--c-accent)))' }}>
                            <Avatar src={profile_img} alt={fullname} size={120} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold">@{profile_username}</h1>
                    <p className="text-xl capitalize text-dark-grey">{fullname}</p>

                    {/* Follows you badge */}
                    {followsYou && profileId !== username && (
                        <span className="follows-you-badge">Follows you</span>
                    )}

                    {/* Stats badges */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-grey rounded-full py-2 px-4">
                            <Icon name="article" className="text-black text-xl" />
                            <span className="font-semibold">{total_posts.toLocaleString()}</span>
                            <span className="text-dark-grey text-sm">Posts</span>
                        </div>
                        <div className="flex items-center gap-2 bg-grey rounded-full py-2 px-4">
                            <Icon name="visibility" className="text-black text-xl" />
                            <span className="font-semibold">{total_reads.toLocaleString()}</span>
                            <span className="text-dark-grey text-sm">Reads</span>
                        </div>
                        <div className="flex items-center gap-2 bg-grey rounded-full py-2 px-4">
                            <Icon name="group" className="text-black text-xl" />
                            <span className="font-semibold">{displayFollowers.toLocaleString()}</span>
                            <span className="text-dark-grey text-sm">Followers</span>
                        </div>
                        <div className="flex items-center gap-2 bg-grey rounded-full py-2 px-4">
                            <Icon name="person_add" className="text-black text-xl" />
                            <span className="font-semibold">{total_following.toLocaleString()}</span>
                            <span className="text-dark-grey text-sm">Following</span>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                        {profileId == username ? (
                        <Link
                            to="/settings/edit-profile"
                            className="btn-light rounded-radius-md flex items-center gap-2"
                        >
                            <Icon name="edit" className="text-xl" />
                            Edit Profile
                        </Link>
                        ) : (
                        <FollowButton
                            targetUserId={profileUserId}
                            onFollowChange={handleFollowChange}
                            size="md"
                        />
                        )}
                    </div>

                    <AboutUser
                        className="max-md:hidden"
                        bio={bio}
                        social_links={social_links}
                        joinedAt={joinedAt}
                    />
                    </div>

                    <div className="max-md:mt-12 w-full">
                    <InPageNavigation
                        routes={["Blogs Published", "About"]}
                        defaultHidden={["About"]}
                    >

                        <>
                        {blogs == null ? (
                            <Loader />
                        ) : blogs.results.length ? (
                            blogs.results.map((blog, i) => {
                            return (
                                <AnimationWrapper
                                key={i}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                <BlogPostCard
                                    content={blog}
                                    author={blog.author.personal_info}
                                />
                                </AnimationWrapper>
                            );
                            })
                        ) : (
                            <NoDataMessage message="No blogs published" />
                        )}
                        <LoadMoreDataBtn
                            state={blogs}
                            fetchDataFun={getBlogs}
                        />
                        </>

                        <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        
                    </InPageNavigation>
                    </div>
                </section>
            : <PageNotFound />
        )}
      </AnimationWrapper>
    );
}

export default ProfilePage;
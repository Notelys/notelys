import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import Avatar from "./Avatar";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import api from "../common/api";
import FollowButton from "./follow-button.component";

const NotificationCard = ({ data, index, notificationState }) => {

    let [ isReplying, setReplying ] = useState(false);

    let { 
            seen, type, reply, comment, replied_on_comment, createdAt, user,
            user: { personal_info: { fullname, username, profile_img } }, 
            blog,
            _id: notification_id,
        } = data;

    // Blog fields (may be null for follow/connect notifications)
    let blog_id = blog?.blog_id;
    let blog_title = blog?.title;
    let blog_oid = blog?._id;

    let { userAuth: { username: author_username, profile_img: author_profile_img, access_token } } = useContext(UserContext);

    let { notifications, notifications: { results, totalDocs }, setNotifications } = notificationState;

    const handleReplyClick = () => {
        setReplying(preval => !preval)
    }

    const handleDelete = (comment_id, type, target) => {

        target.setAttribute("disabled", true);

        api.post("/delete-comment", { _id: comment_id })
        .then(() => {
            if(type == 'comment'){
                results.splice(index, 1);
            }
            else{
                delete results[index].reply;
            }

            target.removeAttribute("disabled");
            setNotifications({ ...notifications, results, totalDocs: totalDocs - 1, deletedDocCount: notifications.deletedDocCount + 1 })
        })

    }

    // Build notification message based on type
    const getNotificationMessage = () => {
        switch(type) {
            case 'like': return 'liked your blog';
            case 'comment': return 'commented on';
            case 'reply': return 'replied on';
            case 'follow': return 'started following you';
            case 'subscribe': return 'subscribed to your publication';
            case 'connect_request': return 'sent you a connect request';
            case 'connect_accepted': return 'accepted your connect request';
            case 'mention': return 'mentioned you';
            case 'share': return 'shared your post';
            default: return 'interacted with you';
        }
    };

    // Social notifications (no blog context)
    const isSocialNotification = ['follow', 'connect_request', 'connect_accepted'].includes(type);

    return (
        <div className={"p-6 border-b border-border " + (!seen ? "border-l-2 border-l-black" : "" )}>
            <div className="flex gap-5 mb-3">
                <Avatar src={profile_img} alt="User" size={56} />
                <div className="w-full">
                    <h1 className="font-medium text-xl text-dark-grey">
                        <span className="lg:inline-block hidden capitalize">{fullname}</span>
                        <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>
                        <span className="font-normal">
                            {getNotificationMessage()}
                        </span>
                    </h1>

                    {/* Blog context — only for blog-related notifications */}
                    {!isSocialNotification && blog && (
                        type == 'reply' ? 
                        <div className="p-4 mt-4 rounded-md bg-grey">
                            <p>{ replied_on_comment?.comment }</p>
                        </div>
                        : <Link to={`/blog/${blog_id}`} className="font-medium text-dark-grey hover:underline line-clamp-1">{`"${blog_title}"`}</Link>
                    )}

                    {/* Follow notification — show follow back button */}
                    {type === 'follow' && (
                        <div className="mt-3">
                            <FollowButton targetUserId={user._id} size="sm" />
                        </div>
                    )}
                </div>
            </div>

            {
                type != 'like' && !isSocialNotification && comment ? 
                <p className="ml-14 pl-5 font-inter text-xl my-5">{comment.comment}</p> 
                : ""
            }

            <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
                
                <p>{getDay(createdAt)}</p>

                {
                    type != 'like' && !isSocialNotification && comment ? 
                    <>
                        {
                            !reply ? 
                            <button className="underline hover:text-black" onClick={handleReplyClick}>Reply</button> : ""
                        }
                        <button className="underline hover:text-black" onClick={(e) => handleDelete(comment._id, "comment", e.target)}>Delete</button>
                    </> : ""
                }

            </div>

            {

                isReplying ? 
                <div className="mt-8">
                    <NotificationCommentField _id={blog_oid} blog_author={user} index={index} replyingTo={comment._id} setReplying={setReplying} notification_id={notification_id} notificationData={notificationState} />
                </div> : ""

            }

            {

                reply ? 
                <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
                    <div className="flex gap-3 mb-3">
                        <Avatar src={author_profile_img} alt="Author" size={32} />

                        <div>
                            <h1 className="font-medium text-xl text-dark-grey">
                                <Link to={`/user/${author_username}`} className="mx-1 text-black underline">@{author_username}</Link>

                                <span className="font-normal">replied to</span>

                                <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>

                            </h1>
                        </div>
                    </div>

                    <p className="ml-14 font-inter text-xl my-2">{reply.comment}</p>

                    <button className="underline hover:text-black ml-14 mt-2" onClick={(e) => handleDelete(comment._id, "reply", e.target)}>Delete</button>

                </div> : ""

            }

        </div>
    )
}

export default NotificationCard;
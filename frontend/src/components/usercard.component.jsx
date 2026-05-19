import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const UserCard = ({ user }) => {

    let { personal_info: { fullname, username, profile_img } } = user;

    return(
        <Link to={`/user/${username}`} className="flex gap-4 items-center mb-4 p-3 -mx-3 rounded-radius-md hover:bg-grey/50 transition-colors group">
            <Avatar src={profile_img} alt={fullname} size={44} />

            <div className="min-w-0">
                <h1 className="font-medium text-base truncate group-hover:text-black transition-colors">{ fullname }</h1>
                <p className="text-dark-grey text-sm truncate">@{username}</p>
            </div>
        </Link>
    )

}

export default UserCard;
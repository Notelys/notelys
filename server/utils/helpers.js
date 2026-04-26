import { nanoid } from 'nanoid';
import User from '../Schema/User.js';
import { generateTokenPair } from '../services/token.service.js';

export const formatDatatoSend = (user) => {

    const { access_token, refresh_token } = generateTokenPair(user._id);

    return{
        access_token,
        refresh_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
};

export const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameExists = await User.exists({ "personal_info.username": username }).then((result) => result)

    isUsernameExists ? username += nanoid().substring(0, 5) : "";

    return username;
};

// Escape special regex characters to prevent ReDoS
export const escapeRegex = (str) => {
    if (!str) return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

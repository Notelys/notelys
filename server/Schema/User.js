import mongoose, { Schema } from "mongoose";

const AVATAR_COLORS = [
    "#6D5D4B", // warm taupe
    "#7A6A58", // muted brown
    "#6B7A6A", // sage green
    "#60727A", // dusty blue
    "#7A6672", // muted plum
    "#8A7458", // soft amber
    "#6F6A84", // muted indigo
    "#7C7C68", // olive grey
];

/**
 * Generate an avatar string from a full name.
 * Format: "avatar:#HEX:INITIALS"
 * e.g. "avatar:#6D5D4B:HS" for "Harish Sehlangia"
 */
export function generateAvatar(fullname) {
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const parts = fullname.trim().split(/\s+/);
    let initials;
    if (parts.length >= 2) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
        initials = parts[0][0].toUpperCase();
    }
    return `avatar:${color}:${initials}`;
}

const userSchema = mongoose.Schema({

    personal_info: {
        fullname: {
            type: String,
            lowercase: true,
            required: true,
            minlength: [3, 'fullname must be 3 letters long'],
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            select: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        username: {
            type: String,
            minlength: [3, 'Username must be 3 letters long'],
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img: {
            type: String,
            default: ""
        },
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_followers: {
            type: Number,
            default: 0
        },
        total_following: {
            type: Number,
            default: 0
        },
        total_connections: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    refreshToken: {
        type: String,
        select: false, // never exposed in normal queries
    },
    blogs: {
        type: [ Schema.Types.ObjectId ],
        ref: 'blogs',
        default: [],
    }

}, 
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

})

export default mongoose.model("users", userSchema);
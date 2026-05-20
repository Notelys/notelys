import mongoose, { Schema } from "mongoose";

const followSchema = mongoose.Schema({
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    following: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
},
{
    timestamps: {
        createdAt: 'followedAt',
        updatedAt: false
    }
});

// Unique compound — a user can only follow another user once
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// List a user's followers efficiently (sorted by newest first)
followSchema.index({ following: 1, followedAt: -1 });

// List who a user follows efficiently (sorted by newest first)
followSchema.index({ follower: 1, followedAt: -1 });

export default mongoose.model("follows", followSchema);

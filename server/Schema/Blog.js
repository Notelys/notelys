import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({

    blog_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        // required: true,
    },
    des: {
        type: String,
        maxlength: 200,
        // required: true
    },
    // EditorJS saves { blocks: [...] }. Stored as an array for legacy reasons.
    // Frontend handles both content[0].blocks and content.blocks patterns.
    content: {
        type: [Schema.Types.Mixed],
        // required: true
    },
    tags: {
        type: [String],
        // required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    draft: {
        type: Boolean,
        default: false
    }

}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 

})

// Indexes for performance
blogSchema.index({ tags: 1 });
blogSchema.index({ draft: 1, publishedAt: -1 });

export default mongoose.model("blogs", blogSchema);
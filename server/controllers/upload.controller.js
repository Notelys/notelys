import { generateUploadURL } from '../config/s3.js';

// Get upload URL
export const getUploadUrl = (req, res) => {
    generateUploadURL()
    .then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
        console.log(err.message)
        return res.status(500).json({ error: err.message })
    })
};

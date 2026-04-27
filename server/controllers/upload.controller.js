import { generateUploadURL } from '../config/s3.js';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
];

// Get upload URL
export const getUploadUrl = (req, res) => {
    const { type } = req.query;

    if (!type || !ALLOWED_MIME_TYPES.includes(type)) {
        return res.status(400).json({ error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` });
    }

    generateUploadURL(type)
    .then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
        console.error('[Upload URL Error]', err.message);
        return res.status(500).json({ error: 'Failed to generate upload URL' });
    })
};

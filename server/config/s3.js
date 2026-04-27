import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

const BUCKET = process.env.AWS_BUCKET || 'blog-app-82817';
const REGION = process.env.AWS_REGION || 'ap-south-1';

// AWS SDK v3 — modular client (replaces deprecated aws-sdk v2)
const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: imageName,
        ContentType: 'image/jpeg',
    });

    return await getSignedUrl(s3, command, { expiresIn: 1000 });
};

/**
 * Extracts the S3 object key from a full S3 URL.
 * e.g. "https://blog-app-82817.s3.ap-south-1.amazonaws.com/abc123.jpeg" → "abc123.jpeg"
 */
const extractKeyFromUrl = (url) => {
    try {
        const parsed = new URL(url);
        // Remove leading slash from pathname
        return decodeURIComponent(parsed.pathname.slice(1));
    } catch {
        return null;
    }
};

/**
 * Deletes a single image from S3 by its full URL.
 * Silently logs errors (non-blocking — blog deletion should succeed even if S3 cleanup fails).
 */
export const deleteFromS3 = async (imageUrl) => {
    const key = extractKeyFromUrl(imageUrl);
    if (!key) return;

    try {
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
        console.log(`🗑️  S3 deleted: ${key}`);
    } catch (err) {
        console.error(`⚠️  S3 delete failed for ${key}:`, err.message);
    }
};

/**
 * Deletes multiple images from S3 in a single batch request.
 * Accepts an array of full S3 URLs.
 */
export const deleteMultipleFromS3 = async (imageUrls) => {
    const keys = imageUrls
        .map(extractKeyFromUrl)
        .filter(Boolean);

    if (keys.length === 0) return;

    try {
        await s3.send(new DeleteObjectsCommand({
            Bucket: BUCKET,
            Delete: {
                Objects: keys.map(Key => ({ Key })),
                Quiet: true,
            },
        }));
        console.log(`🗑️  S3 batch deleted ${keys.length} image(s)`);
    } catch (err) {
        console.error(`⚠️  S3 batch delete failed:`, err.message);
    }
};

import aws from 'aws-sdk';
import { nanoid } from 'nanoid';

// Setting up S3 bucket
const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'blog-app-82817',
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg"
    });
};

import AWS from 'aws-sdk';

/**
 * Digital Ocean Spaces Connection
 */
const spacesEndpoint = new AWS.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.ACCESS_SECRET_KEY
    });
export default s3;
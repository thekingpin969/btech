import axios from 'axios';
import InternetArchive from 'internetarchive-sdk-js';
import { randomBytes } from 'crypto';
import proxyReq from '../../utils/proxyReq';

async function upload(videoUri: string) {
    try {
        console.log('uploading video....')
        const ia = new InternetArchive(`${process.env.IA_ACCESS_KEY}:${process.env.IA_SECRET_KEY}`, { testmode: false })

        const response = await proxyReq({ method: 'GET', url: videoUri, responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        console.log('size: ', (buffer.length / 1024).toFixed(3))
        const res: any = await ia.createItem({
            identifier: randomBytes(12).toString('hex'),
            collection: 'opensource_movies',
            mediatype: 'movies',
            upload: {
                filename: `${randomBytes(8).toString('hex')}.mp4`,
                data: buffer,
            },
            metadata: {
                title: 'Generic video',
                creator: 'Generic creator',
                subject: 'generic',
            },
        });
        return { ...res, src_url: 'https://s3.us.archive.org/' + res.upload.path, size: buffer.length }
    } catch (error) {
        console.log('error while uploading to IA, retrying...', error)
        return await upload(videoUri)
    }
}

export default upload
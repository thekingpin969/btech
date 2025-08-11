import axios from 'axios';
import InternetArchive from 'internetarchive-sdk-js';
import { randomBytes } from 'crypto';

async function upload(videoUri: string) {
    try {
        const ia = new InternetArchive(`${process.env.IA_ACCESS_KEY}:${process.env.IA_SECRET_KEY}`, { testmode: false })

        const axiosRes = await axios.get(videoUri, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(axiosRes.data);

        const res: any = await ia.createItem({
            identifier: randomBytes(12).toString('hex'),
            collection: 'opensource_movies',
            mediatype: 'movies',
            upload: {
                filename: randomBytes(12).toString('hex') + '.mp4',
                data: buffer,
            },
            metadata: {
                title: 'Generic video',
                creator: 'Generic creator',
                subject: 'generic',
            },
        });

        return { ...res, src_url: 'https://s3.us.archive.org/' + res.upload.path }
    } catch (error) {
        console.log('error while uploading to IA, retrying...', error)
        return await upload(videoUri)
    }
}

export default upload
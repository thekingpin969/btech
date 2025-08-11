import axios from 'axios';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { config } from 'dotenv'
import { randomBytes } from 'crypto';
config({ path: '../.env' })

const IA_ACCESS_KEY = process.env.IA_ACCESS_KEY
const IA_SECRET_KEY = process.env.IA_SECRET_KEY

async function streamUploadToInternetArchive(itemId: string, videoUrl: string) {
    // Fetch video as stream from external URL
    const response = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream',
    });

    // Prepare form data for upload
    const form = new FormData();
    form.append('file', response.data, {
        filename: "video.mp4",
        contentType: 'video/mp4'
    });
    form.append('metadata', JSON.stringify({
        title: "Your Video Title",
        collection: "opensource",
        description: "Uploaded without local storage"
    }));

    // Upload the stream data to Internet Archive
    console.log(`https://s3.us.archive.org/${itemId}`)
    const uploadResponse = await fetch(`https://s3.us.archive.org/${itemId}`, {
        method: 'PUT',
        headers: {
            ...form.getHeaders(),
            'x-amz-date': new Date().toISOString(),
            authorization: `LOW ${IA_ACCESS_KEY}:${IA_SECRET_KEY}`,
            "x-archive-meta01-collection": "opensource_movies",
            "x-archive-meta-mediatype": "movies"
            // Include your IA authorization headers here using apiKey and apiSecret
        },
        body: form,
    });
    console.log(uploadResponse)
    if (uploadResponse.ok) {
        console.log('Upload successful');
    } else {
        console.error('Upload failed', await uploadResponse.text());
    }
}

await streamUploadToInternetArchive(`${randomBytes(12).toString('hex')}.mp4`, 'https://www.sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4')
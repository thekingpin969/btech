import { config } from 'dotenv'
import { randomBytes } from 'crypto';
import proxyReq from '../utils/proxyReq';
config({ path: '../.env' })
import InternetArchive from 'internetarchive-sdk-js';

const IA_ACCESS_KEY = process.env.IA_ACCESS_KEY
const IA_SECRET_KEY = process.env.IA_SECRET_KEY

async function upload(itemId: string, videoUrl: string) {
    try {
        const ia = new InternetArchive(`${IA_ACCESS_KEY}:${IA_SECRET_KEY}`, { testmode: false })
        const response = await proxyReq({ method: 'GET', url: videoUrl, responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        const res: any = await ia.createItem({
            identifier: randomBytes(12).toString('hex'),
            collection: 'opensource_movies',
            mediatype: 'movies',
            upload: {
                filename: `${itemId}.mp4`,
                data: buffer,
            },
            metadata: {
                title: 'Generic video',
                creator: 'Generic creator',
                subject: 'generic',
            },
        });
        return { url: 'https://s3.us.archive.org/' + res.upload.path, ...res }
    } catch (error: any) {
        console.log('error while uploading to ia, retrying...', error.message)
    }
}

// await streamUploadToInternetArchive(`${randomBytes(12).toString('hex')}.mp4`, 'https://rr3---sn-aigl6nze.googlevideo.com/videoplayback?expire=1755345902&ei=jh-gaLOjAd2F0u8PqIyk0A0&ip=2a09%3Abac5%3A47e9%3A632%3A%3A9e%3A17&id=o-AGzPQSRNXxFYRpOBXcqTyL-iJt0p88yKG7i9p21d3DJQ&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1755324302%2C&mh=aL&mm=31%2C26&mn=sn-aigl6nze%2Csn-4g5e6nzs&ms=au%2Conr&mv=m&mvi=3&pl=48&rms=au%2Cau&initcwndbps=1596250&bui=AY1jyLPTlj3w_mfeodm9Ksa_CuT8cAx8XiYAgq9bBTQk1EgoB4fUp_zRdYFjlKZE7IEwVWe5j-doybio&vprv=1&svpuc=1&mime=video%2Fmp4&ns=OTSvclPwjgJ4KoCYPdeMWjQQ&rqh=1&gir=yes&clen=5608077&ratebypass=yes&dur=149.072&lmt=1754115714921618&mt=1755324062&fvip=5&lmw=1&fexp=51548755%2C51557447%2C51565115%2C51565681&c=TVHTML5&sefc=1&txp=6209224&n=es6vg6_3obEhTA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRAIgAsxtmCRWm8bOomVz7HqPys1PhMM3C_pdyCQHn55CuXICIErVK8we-wfqWV2kVhjyfdu5fqZ52XPsE-z_SDImYGSZ&sig=AJfQdSswRgIhAO2Jzxiftk3U8Fmq0ITQrnNPI7bpwPSLZU6Pc81P-A8IAiEA_S8qI5feHVVks5fAoTuzhj_bXXCQKPA8lHIJVfAaAqM%3D&title=Zero+to+Infinity+%F0%9F%9A%80+%7C+The+BTech+Shortcut+You+Wish+You+Knew+Earlier%21')
//     .then(console.log)

export default upload
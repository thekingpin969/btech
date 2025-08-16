import getYtScrUri from "../../helpers/getYtSrcUri";
import reportOnTelegramChannel from "./reportOnTelegramChannel";
import upload from "./upload"

async function manageUpload(videos: any[]) {
    try {
        if (videos.length <= 0) return console.log('no videos...')

        for (let i = 0; i < videos.length; i++) {
            const vid: any = videos[i];
            const res = await getYtScrUri(vid.videoId)
            const upRes = await upload(res)
            await reportOnTelegramChannel(vid.thumbnails.high.url, { ...upRes, ...vid })
            console.log(`upload of ${vid.videoId} completed...`)
        }
    } catch (error: any) {
        console.log(error.message)
    }
}

export default manageUpload
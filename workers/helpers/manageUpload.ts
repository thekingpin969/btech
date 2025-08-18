import Database from "../../db/mongodb";
import getYtScrUri from "../../helpers/getYtSrcUri";
import reportOnTelegramChannel from "./reportOnTelegramChannel";
import upload from "./upload"

const db = new Database()

async function manageUpload(videos: any[]) {
    try {
        if (videos.length <= 0) return console.log('no videos...')

        for (let i = 0; i < videos.length; i++) {
            const vid: any = videos[i];
            console.log(vid)
            const res = await getYtScrUri(vid.videoId)
            console.log(res)
            const upRes = await upload(res)
            console.log('video uploaded')
            await reportOnTelegramChannel(vid.thumbnails.high.url, { ...upRes, ...vid })
            console.log(`upload of ${vid.videoId} completed...`)
            db.addLogs({ ...upRes, ...vid }, 'videos')
        }
    } catch (error: any) {
        console.log(error.message)
        throw Error(error)
    }
}

export default manageUpload
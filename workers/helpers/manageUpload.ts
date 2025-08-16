import getYtScrUri from "../../helpers/getYtSrcUri";
import upload from "./upload"

async function manageUpload(videos: any[]) {
    try {
        if (videos.length <= 0) return console.log('no videos...')

        for (let i = 0; i < videos.length; i++) {
            const vid: any = videos[i];
            const res = await getYtScrUri('ubI6EmuM1iQ')
            const upRes = await upload(res)
            console.log(upRes)
            break;
        }
    } catch (error) {
        console.log(error)
    }
}

export default manageUpload
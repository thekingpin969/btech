import Database from '../db/mongodb'
import { config } from 'dotenv'
import fetchVideos from './helpers/fetchVideos'
import filterOutVideos from './helpers/filterOutVideos'
import manageUpload from './helpers/manageUpload'
import axios from 'axios'
import executeWithRetry from '../utils/executeWithRetry'

config({ path: '../.env' })
const db = new Database()

await db.setDB()

async function uploadManager() {
    try {

        console.log('fetching videos')
        const { success, res: videos, error }: { res: any, success: boolean, error: any } = await executeWithRetry(fetchVideos, 5)
        if (!success) throw Error(`cannot fetch videos:${error}`)
        console.log(videos.length, ' videos fetched')

        console.log('filtering videos')
        const { success: filterOutVideosSuccess, res: filteredVideos } = await executeWithRetry(async () => await filterOutVideos(videos))
        if (!filterOutVideosSuccess) throw Error(`filtering videos failed:${error}`)

        console.log('uploading videos')
        manageUpload((filteredVideos as any))
    } catch (error) {
        console.log('system error:', error)
        await axios.get(`http://xdroid.net/api/message?k=k-7c2c2c6b4e68&t=error+on+btechh&c=upload+error,retrying...`)
    }
}

await uploadManager()
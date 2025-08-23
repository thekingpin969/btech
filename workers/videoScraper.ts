import Database from '../db/mongodb'
import { config } from 'dotenv'
import fetchVideos from './helpers/fetchVideos'
import filterOutVideos from './helpers/filterOutVideos'
import manageUpload from './helpers/manageUpload'
import axios from 'axios'

config({ path: '../.env' })
const db = new Database()

await db.setDB()

async function uploadManager() {
    try {

        console.log('fetching videos')
        const videos = await fetchVideos()
        console.log(videos.length, ' videos fetched')

        console.log('filtering videos')
        const filteredVideos: any = await filterOutVideos(videos)

        console.log('uploading videos')
        manageUpload(filteredVideos)
    } catch (error) {
        console.log('system error:', error)
        await axios.get(`http://xdroid.net/api/message?k=k-7c2c2c6b4e68&t=error+on+btechh&c=upload+error,retrying...`)
        return await uploadManager()
    }
}

await uploadManager()
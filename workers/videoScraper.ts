import Database from '../db/mongodb'
import { config } from 'dotenv'
import fetchVideos from './helpers/fetchVideos'
import filterOutVideos from './helpers/filterOutVideos'
import manageUpload from './helpers/manageUpload'

config({ path: '../.env' })
const db = new Database()

await db.setDB()

console.log('fetching videos')
const videos = await fetchVideos()
console.log(videos.length, ' videos fetched')

console.log('filtering videos')
const filteredVideos = await filterOutVideos(videos)

console.log('uploading videos')
manageUpload(filteredVideos)
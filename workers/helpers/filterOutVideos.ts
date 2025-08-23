import Database from "../../db/mongodb"

const db = new Database()

async function filterOutVideos(fetchedVideos: any[]) {
    try {
        const { data } = (await db.getLogs({}, 'videos')) || { data: [] };
        const savedVideos: any[] = data || [];

        // Filter out videos that already exist in savedVideos
        const filteredVideos = fetchedVideos.filter(
            (video: any) => !savedVideos.some(item => item.videoId == video.videoId)
        );
        return filteredVideos;
    } catch (error: any) {
        throw Error(error.message)
    }
}

export default filterOutVideos
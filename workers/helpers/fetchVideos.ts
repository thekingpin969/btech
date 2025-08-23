import { youtube } from "@googleapis/youtube";
import Database from "../../db/mongodb";
import getChannels from "./getChannels";

const db = new Database()


async function fetchVideos(): Promise<any[]> {
    const API_KEY = process.env.G_API_KEY;

    const yt: any = youtube({
        version: "v3",
        auth: API_KEY,
    });
    try {
        let allVideos: any[] = [];

        const channels = await getChannels();
        if (channels && Array.isArray(channels)) {
            for (const CHANNEL_ID of channels) {
                let nextPageToken = "";
                do {
                    const res = await yt.search.list({
                        part: ["id", "snippet"],
                        channelId: CHANNEL_ID,
                        order: "date",
                        maxResults: 50,
                        type: ["video"],
                        pageToken: nextPageToken || undefined,
                    });

                    if (res.data.items && res.data.items.length > 0) {
                        allVideos.push(...res.data.items.map((item: any) => (item)));
                    }

                    nextPageToken = res.data.nextPageToken;
                } while (nextPageToken);
            }
        }

        return allVideos.filter((vid: any) =>
            vid?.snippet?.liveBroadcastContent != "live" &&
            vid?.snippet?.liveBroadcastContent != "upcoming"
        ).map((item: any) => {
            const {
                etag,
                id: { videoId, kind },
                snippet: { publishedAt, channelId, title, description, thumbnails, publishTime }
            } = item;
            return { etag, videoId, kind, publishTime, publishedAt, channelId, title, description, thumbnails, temp: { ...item } };
        });

    } catch (error: any) {
        console.error('videos fetching failed, retrying...', error.message);
        return await fetchVideos();
    }
}

export default fetchVideos
import proxyReq from "../utils/proxyReq"

async function getYtScrUri(vidId: string) {
    try {
        const response: any = await proxyReq({ method: 'POST', url: "https://ssvid.net/api/ajax/search?hl=en", data: `query=https://www.youtube.com/watch?v=${vidId}&vt=home` })
        const { links: { mp4: { auto } } } = response.data || {}
        const fileId = auto.k
        const { data } = await proxyReq({ method: 'POST', url: 'https://ssvid.net/api/ajax/convert?hl=en', data: `vid=${encodeURIComponent(vidId)}&k=${encodeURIComponent(fileId)}` })
        if (!data.dlink) throw Error('src uri not founded!')
        return data.dlink
    } catch (error: any) {
        throw Error(error.message)
    }
}


export default getYtScrUri
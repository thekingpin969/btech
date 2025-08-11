import axios, { type AxiosRequestConfig } from "axios-https-proxy-fix"

async function proxyReq(params: AxiosRequestConfig = {}) {
    try {
        const { data } = await axios.get('https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=json&timeout=20000');
        if (!data || !Array.isArray(data.proxies) || data.proxies.length === 0) {
            throw new Error('No proxies found from the proxy provider');
        }
        const proxies: string[] = data.proxies || [];
        const shuffled = proxies.sort(() => 0.5 - Math.random())
        const randomProxies = shuffled.slice(0, 500)

        const reqArray = []
        for (let i = 0; i < randomProxies.length; i++) {
            const proxyStr = randomProxies[i];
            reqArray.push(req(proxyStr, params))
        }
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000 * 60 * 5));
        const res: any = await Promise.race([
            Promise.any(reqArray),
            timeout
        ]);
        return res
    } catch (error: any) {
        console.log('proxy request failed, retrying...', error.message)
        return await proxyReq(params)
    }
}

async function req(proxy: any = {}, params: AxiosRequestConfig = {}) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const res: any = await axios({
                ...params,
                proxy: {
                    host: proxy.ip,
                    port: proxy.port,
                }
            })
            resolve(res)
        } catch (error) {
        }
    })
}

export default proxyReq
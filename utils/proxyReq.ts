import axios, { type AxiosRequestConfig } from "axios-https-proxy-fix"

async function proxyReq(params: AxiosRequestConfig = {}, proxyCount: number = 500) {
    try {
        const { data } = await axios.get('https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=json&timeout=2000');
        if (!data || !Array.isArray(data.proxies) || data.proxies.length === 0) {
            throw new Error('No proxies found from the proxy provider');
        }
        const proxies: string[] = data.proxies || [];
        const shuffled = proxies.sort(() => 0.5 - Math.random())
        const randomProxies = shuffled.slice(0, proxyCount)

        // Create an AbortController for each request
        const controllers: AbortController[] = [];
        const reqArray = randomProxies.map(proxyStr => {
            const controller = new AbortController();
            controllers.push(controller);
            return req(proxyStr, params, controller);
        });

        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000 * 60 * 5));
        const res: any = await Promise.race([
            Promise.any(reqArray),
            timeout
        ]);

        // Abort all other requests
        controllers.forEach(controller => controller.abort());

        return res;
    } catch (error: any) {
        console.log('proxy request failed, retrying...', error.message)
        return await proxyReq(params)
    }
}

async function req(proxy: any = {}, params: AxiosRequestConfig = {}, controller?: AbortController) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            // @ts-ignore
            const res: any = await axios({
                ...params,
                proxy: {
                    host: proxy.ip,
                    port: proxy.port,
                },
                signal: controller?.signal
            })
            res.status == 200 && resolve(res)
        } catch (error) {
            // Ignore errors
        }
    })
}

export default proxyReq
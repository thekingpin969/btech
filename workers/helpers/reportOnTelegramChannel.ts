async function reportOnTelegramChannel(thumbnail: string, info: any = {}) {
    try {
        const BOT_TOKEN = process.env.BOT_TOKEN
        const CHAT_ID = process.env.CHAT_ID;
        if (!BOT_TOKEN || !CHAT_ID) throw new Error("Missing BOT_TOKEN or CHAT_ID");
        console.log(BOT_TOKEN, CHAT_ID, info)
        const caption = `new upload to server\n\nvideoId: ${info.videoId}\ntitle: ${info.title}\nsize: ${(info.size / 1024 / 1024).toFixed(2)}mb\n\nsrc url : ${info.src_url}\n\nupload time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                photo: thumbnail,
                caption: caption
            })
        });
        if (!res.ok) {
            throw new Error(`Telegram API error: ${res.statusText}`);
        }
    } catch (error: any) {
        console.log(error.message)
        return await reportOnTelegramChannel(thumbnail, info)

    }
}

export default reportOnTelegramChannel
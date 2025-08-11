async function getChannels() {
    try {
        const channels = ["UCxMqlK2NC8mvaliK_ON3WAg"]
        return channels
    } catch (error) {
        console.error('getting channels failed, retrying...')
        await getChannels()
    }
}

export default getChannels
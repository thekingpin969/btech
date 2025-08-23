async function executeWithRetry<T>(func: () => Promise<T>, maxRetry = 5) {
    let attempts = 0;
    while (attempts < maxRetry) {
        try {
            const res = await func();
            return { success: true, res, error: null }
        } catch (error) {
            attempts++;
            if (attempts >= maxRetry) {
                return { retryLimitExceeded: true, success: false, res: null, error }
            }
        }
    }

    throw new Error("Unexpected error in executeWithRetry");
}


export default executeWithRetry
import { createClient } from 'redis';

const { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

const Redis = createClient({
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT ? Number(REDIS_PORT) : undefined,
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
        keepAlive: true,
        connectTimeout: 10000
    }
});

Redis.on('error', err => {
    console.error('Redis Client Error:', err);
});
Redis.on('connect', () => {
    console.log('Redis client connected');
});
Redis.on('reconnecting', () => {
    console.warn('Redis client reconnecting...');
});

try {
    if (!Redis.isOpen) {
        await Redis.connect();
    }
} catch (err) {
    console.error('Failed to connect to Redis:', err);
}

export default Redis;
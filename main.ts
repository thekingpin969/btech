import { config } from 'dotenv'
config({ path: './.env' })

import { serve } from 'bun'
import routes from './routes/routes'
import Database from './db/mongodb'

const db = new Database()

await db.setDB()
// await import('./db/redis')

new Worker(new URL('./workers/videoScraper.ts', import.meta.url).href, { type: 'module' });

serve({
    fetch: routes.fetch,
    port: 3000,
    idleTimeout: 30,
})

console.log('server running on port 3000')
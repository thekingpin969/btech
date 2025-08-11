import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use(cors({ origin: '*' }))

// get requests
app.get('/', (c) => c.text('ok'))

export default app

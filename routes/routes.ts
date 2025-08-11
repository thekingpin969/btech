import { Hono } from 'hono'
import app from './app/app'

const routes = new Hono()

routes.route('/', app)
export default routes
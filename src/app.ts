import env from 'dotenv'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import routes from './routes'

env.config()

const app = express()
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: '*'
  })
)

app.use(routes)

export default app

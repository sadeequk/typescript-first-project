import env from 'dotenv'
import app from './app'
import database from './configs/database'
import { log } from './utils/index'
env.config()
const PORT = Number(process.env.PORT) || 8080

database.connect().then(() => {
  app.listen(PORT, () => {
    log('server', `Server is listening on port ${PORT}.`)
  })
})

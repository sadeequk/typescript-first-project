import env from 'dotenv'
import mongoose from 'mongoose'
import { log } from '../utils/index'

env.config()

const connect = async () => {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI is not set in environment variables')

    log('info', 'Connecting to Database...')
    mongoose.set('strictQuery', false)
    const client = await mongoose.connect(uri)

    console.log(`Connected to (${client.connection.name}) Database`)
  } catch (error) {
    log('error', `Error connecting to Database!`)
    log('error', error)
    process.exit(1)
  }
}

export default { connect }

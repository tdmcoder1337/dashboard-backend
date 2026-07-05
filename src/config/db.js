import mongoose from 'mongoose'

let connectionPromise = null

const connectDB = async () => {
  if (connectionPromise) return connectionPromise

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn('MONGODB_URI not set — skipping DB connection')
    return null
  }

  mongoose.set('strictQuery', true)

  connectionPromise = mongoose.connect(uri, {
    dbName: 'dashboard',
  })

  try {
    await connectionPromise
    console.log('MongoDB connected to dashboard database')
  } catch (err) {
    connectionPromise = null
    console.error('MongoDB connection error:', err.message)
  }
}

export default connectDB

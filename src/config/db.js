import mongoose from 'mongoose'

let connectionPromise = null

const connectDB = async () => {
  if (connectionPromise) {
    // Agar connection avval o'rnatilgan bo'lsa, hali ham tirikligini tekshir
    if (mongoose.connection.readyState === 1) return connectionPromise
    // Agar uzilgan bo'lsa, qayta urinish uchun promise'ni reset qil
    connectionPromise = null
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn('MONGODB_URI not set — skipping DB connection')
    return null
  }

  mongoose.set('strictQuery', true)

  connectionPromise = mongoose.connect(uri, {
    dbName: 'dashboard',
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected — will reconnect on next request')
    connectionPromise = null
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
    connectionPromise = null
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

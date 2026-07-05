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
    throw new Error('MONGODB_URI environment variable is not set')
  }

  mongoose.set('strictQuery', true)

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected — will reconnect on next request')
    connectionPromise = null
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
    connectionPromise = null
  })

  connectionPromise = mongoose.connect(uri, {
    dbName: 'dashboard',
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })

  await connectionPromise
  console.log('MongoDB connected to dashboard database')
}

export default connectDB

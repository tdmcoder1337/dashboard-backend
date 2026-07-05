import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is missing')
  }

  mongoose.set('strictQuery', true)
  

  await mongoose.connect(uri, {
    dbName: 'dashboard',
  })

  console.log('MongoDB connected to dashboard database')
}

export default connectDB

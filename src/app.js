import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/messages.routes.js'
import productRoutes from './routes/products.routes.js'
import userRoutes from './routes/users.routes.js'

dotenv.config()

const app = express()

app.use(async (_req, _res, next) => {
  if (process.env.MONGODB_URI && mongoose.connection.readyState === 0) {
    try { await connectDB() } catch { /* ignore */ }
  }
  next()
})

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://tdmcoder-dashboard.vercel.app',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
)
app.use(express.json({ limit: '5mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})


app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
  })
})




export default app

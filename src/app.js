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

const requireDB = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB()
    } catch (error) {
      return res.status(503).json({
        message: 'Database connection failed: ' + error.message,
      })
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection failed, please try again later' })
    }
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', requireDB, authRoutes)
app.use('/api/messages', requireDB, messageRoutes)
app.use('/api/products', requireDB, productRoutes)
app.use('/api/users', requireDB, userRoutes)

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})


app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
  })
})




export default app

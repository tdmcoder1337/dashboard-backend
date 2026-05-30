import app from './src/app.js'
import connectDB from './src/config/db.js'

const PORT = process.env.PORT || 8000

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Auth API running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})

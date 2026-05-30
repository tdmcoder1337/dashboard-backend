import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

const normalizeUsername = (username = '') => username.trim().toLowerCase()

const sendUser = (res, status, message, user) => {
  res.status(status).json({
    message,
    user: {
      id: user._id,
      username: user.username,
    },
  })
}

export const register = async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body.username)
    const { password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ username, password: hashedPassword })

    sendUser(res, 201, 'Registered successfully', user)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body.username)
    const { password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    sendUser(res, 200, 'Logged in successfully', user)
  } catch (error) {
    next(error)
  }
}

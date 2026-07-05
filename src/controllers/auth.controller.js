import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

const normalizeUsername = (username = '') => username.trim().toLowerCase()

const sendUser = (res, status, message, user) => {
  res.status(status).json({
    message,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar || '',
      bio: user.bio || '',
      phone: user.phone || '',
      country: user.country || '',
      city: user.city || '',
      address: user.address || '',
      postalCode: user.postalCode || '',
      emailNotifications: user.emailNotifications !== false,
      profileVisible: user.profileVisible !== false,
      registeredAt: user.createdAt,
      lastLogin: user.lastLogin,
      lastSeen: user.lastSeen,
      isOnline: user.lastSeen && Date.now() - new Date(user.lastSeen).getTime() <= 2 * 60 * 1000,
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
    const user = await User.create({
      username,
      name: req.body.name || username,
      email: req.body.email || '',
      password: hashedPassword,
    })

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

    if (user.status === 'Blocked') {
      return res.status(403).json({ message: 'User is blocked' })
    }

    user.lastLogin = new Date()
    user.lastSeen = new Date()
    await user.save()

    sendUser(res, 200, 'Logged in successfully', user)
  } catch (error) {
    next(error)
  }
}

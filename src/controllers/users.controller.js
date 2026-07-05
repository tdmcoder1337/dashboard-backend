import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

const normalizeUsername = (username = '') => username.trim().replace(/^@/, '').toLowerCase()
const normalizeEmail = (email = '') => email.trim().toLowerCase()

const ONLINE_THRESHOLD_MS = 2 * 60 * 1000

const isUserOnline = (user) =>
  user.status !== 'Blocked' &&
  Boolean(user.lastSeen) &&
  Date.now() - new Date(user.lastSeen).getTime() <= ONLINE_THRESHOLD_MS

const serializeUser = (user) => ({
  id: user._id,
  name: user.name || user.username || '',
  username: user.username ? `@${user.username}` : '',
  email: user.email || '',
  role: user.role || 'User',
  status: user.status || 'Active',
  lastLogin: user.lastLogin,
  lastSeen: user.lastSeen,
  isOnline: isUserOnline(user),
  registeredAt: user.createdAt,
  avatar: user.avatar || '',
  bio: user.bio || '',
  phone: user.phone || '',
  country: user.country || '',
  city: user.city || '',
  address: user.address || '',
  postalCode: user.postalCode || '',
  emailNotifications: user.emailNotifications !== false,
  profileVisible: user.profileVisible !== false,
})

export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users.map(serializeUser))
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const username = normalizeUsername(req.body.username)
    const email = normalizeEmail(req.body.email)

    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' })
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' })
    }

    const password = req.body.password || 'password123'
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      username,
      name: req.body.name || username,
      email,
      password: hashedPassword,
      role: req.body.role || 'User',
      status: req.body.status || 'Active',
      avatar: req.body.avatar || '',
    })

    res.status(201).json(serializeUser(user))
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const update = {}

    if (req.body.username !== undefined) update.username = normalizeUsername(req.body.username)
    if (req.body.name !== undefined) update.name = req.body.name.trim()
    if (req.body.email !== undefined) update.email = normalizeEmail(req.body.email)
    if (req.body.role !== undefined) update.role = req.body.role
    if (req.body.status !== undefined) update.status = req.body.status
    if (req.body.avatar !== undefined) update.avatar = req.body.avatar
    if (req.body.bio !== undefined) update.bio = String(req.body.bio).trim()
    if (req.body.phone !== undefined) update.phone = String(req.body.phone).trim()
    if (req.body.country !== undefined) update.country = String(req.body.country).trim()
    if (req.body.city !== undefined) update.city = String(req.body.city).trim()
    if (req.body.address !== undefined) update.address = String(req.body.address).trim()
    if (req.body.postalCode !== undefined) update.postalCode = String(req.body.postalCode).trim()
    if (req.body.emailNotifications !== undefined) update.emailNotifications = Boolean(req.body.emailNotifications)
    if (req.body.profileVisible !== undefined) update.profileVisible = Boolean(req.body.profileVisible)

    if (update.username === '') {
      return res.status(400).json({ message: 'Username cannot be empty' })
    }

    if (req.body.newPassword !== undefined) {
      const newPassword = String(req.body.newPassword)

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
      }

      const currentUser = await User.findById(req.params.id)

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      const passwordMatches = await bcrypt.compare(
        String(req.body.currentPassword || ''),
        currentUser.password
      )

      if (!passwordMatches) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      update.password = await bcrypt.hash(newPassword, 12)
    }

    if (update.username || update.email) {
      const duplicateFilter = []

      if (update.username) duplicateFilter.push({ username: update.username })
      if (update.email) duplicateFilter.push({ email: update.email })

      const duplicateUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: duplicateFilter,
      })

      if (duplicateUser) {
        return res.status(409).json({ message: 'Username or email already exists' })
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(serializeUser(user))
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or email already exists' })
    }

    next(error)
  }
}

export const heartbeat = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.status === 'Blocked') {
      return res.status(403).json({ message: 'User is blocked' })
    }

    user.lastSeen = new Date()
    await user.save()

    res.json(serializeUser(user))
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

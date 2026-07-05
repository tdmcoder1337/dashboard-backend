import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['Admin', 'Moderator', 'User'],
      default: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked'],
      default: 'Active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    postalCode: {
      type: String,
      trim: true,
      default: '',
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    profileVisible: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
)

const User = mongoose.model('User', userSchema)

export default User

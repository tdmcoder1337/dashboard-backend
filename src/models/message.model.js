import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Unread', 'Read'],
      default: 'Unread',
    },
  },
  {
    timestamps: true,
    collection: 'messages',
  }
)

const Message = mongoose.model('Message', messageSchema)

export default Message

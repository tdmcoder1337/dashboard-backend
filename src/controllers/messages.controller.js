import Message from '../models/message.model.js'
import User from '../models/user.model.js'

const PARTICIPANT_FIELDS = 'name username email avatar'

const serializeParticipant = (user) => {
  if (!user) {
    return { id: null, name: "O'chirilgan foydalanuvchi", username: '', email: '', avatar: '' }
  }

  return {
    id: user._id,
    name: user.name || user.username || '',
    username: user.username ? `@${user.username}` : '',
    email: user.email || '',
    avatar: user.avatar || '',
  }
}

const serializeMessage = (message) => ({
  id: message._id,
  from: serializeParticipant(message.from),
  to: serializeParticipant(message.to),
  subject: message.subject || '',
  text: message.text,
  status: message.status,
  createdAt: message.createdAt,
})

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' })
    }

    const [inbox, sent] = await Promise.all([
      Message.find({ to: userId })
        .sort({ createdAt: -1 })
        .populate('from', PARTICIPANT_FIELDS)
        .populate('to', PARTICIPANT_FIELDS),
      Message.find({ from: userId })
        .sort({ createdAt: -1 })
        .populate('from', PARTICIPANT_FIELDS)
        .populate('to', PARTICIPANT_FIELDS),
    ])

    res.json({
      inbox: inbox.map(serializeMessage),
      sent: sent.map(serializeMessage),
    })
  } catch (error) {
    next(error)
  }
}

export const createMessage = async (req, res, next) => {
  try {
    const { from, to, subject = '', text = '' } = req.body

    if (!from || !to) {
      return res.status(400).json({ message: 'Sender and recipient are required' })
    }

    if (String(from) === String(to)) {
      return res.status(400).json({ message: "O'zingizga xabar yubora olmaysiz" })
    }

    if (!text.trim()) {
      return res.status(400).json({ message: 'Message text is required' })
    }

    const [sender, recipient] = await Promise.all([User.findById(from), User.findById(to)])

    if (!sender || !recipient) {
      return res.status(404).json({ message: 'Sender or recipient not found' })
    }

    const message = await Message.create({ from, to, subject: subject.trim(), text: text.trim() })
    await message.populate([
      { path: 'from', select: PARTICIPANT_FIELDS },
      { path: 'to', select: PARTICIPANT_FIELDS },
    ])

    res.status(201).json(serializeMessage(message))
  } catch (error) {
    next(error)
  }
}

export const markMessageRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: 'Read' },
      { new: true }
    )
      .populate('from', PARTICIPANT_FIELDS)
      .populate('to', PARTICIPANT_FIELDS)

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    res.json(serializeMessage(message))
  } catch (error) {
    next(error)
  }
}

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)

    if (!message) {
      return res.status(404).json({ message: 'Message not found' })
    }

    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

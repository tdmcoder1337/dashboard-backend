import { Router } from 'express'
import {
  createMessage,
  deleteMessage,
  getMessages,
  markMessageRead,
} from '../controllers/messages.controller.js'

const router = Router()

router.get('/', getMessages)
router.post('/', createMessage)
router.patch('/:id/read', markMessageRead)
router.delete('/:id', deleteMessage)

export default router

import { Router } from 'express'
import { createUser, deleteUser, getUsers, heartbeat, updateUser } from '../controllers/users.controller.js'

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)
router.post('/:id/heartbeat', heartbeat)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router

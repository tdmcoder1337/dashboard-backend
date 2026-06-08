import { Router } from 'express'
import {
  createProduct,
  getCategories,
  getProducts,
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/categories', getCategories)
router.post('/', createProduct)

export default router

import Product from '../models/products.js'
import { PRODUCT_CATEGORIES } from '../constants/categories.js'

export const getProducts = async (req, res, next) => {
  try {
    const { kategoriya } = req.query
    const filter = {}

    if (kategoriya && kategoriya !== 'all') {
      filter.kategoriya = kategoriya
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    next(error)
  }
}

export const getCategories = (_req, res) => {
  res.json(PRODUCT_CATEGORIES)
}

export const createProduct = async (req, res, next) => {
  try {
    const { nomi, narxi, birlik, kategoriya, rasm } = req.body

    if (!nomi || narxi === undefined || !birlik) {
      return res.status(400).json({ message: 'nomi, narxi and birlik are required' })
    }

    if (kategoriya && !PRODUCT_CATEGORIES.includes(kategoriya)) {
      return res.status(400).json({ message: 'Invalid kategoriya' })
    }

    const product = await Product.create({ nomi, narxi, birlik, kategoriya, rasm })
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

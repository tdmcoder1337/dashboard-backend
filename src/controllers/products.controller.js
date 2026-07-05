import Product from '../models/products.js'
import { PRODUCT_CATEGORIES } from '../constants/categories.js'

export const getProducts = async (req, res, next) => {
  try {
    const kategoriya = req.query.kategoriya || req.query.category
    const filter = {}

    if (kategoriya && kategoriya !== 'all') {
      filter.kategoriya = kategoriya
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products.map(p => ({ ...p.toObject(), category: p.kategoriya })))
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

    const cat = kategoriya || req.body.category
    if (cat && !PRODUCT_CATEGORIES.includes(cat)) {
      return res.status(400).json({ message: 'Invalid kategoriya' })
    }

    const product = await Product.create({ nomi, narxi, birlik, kategoriya: cat, rasm })
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

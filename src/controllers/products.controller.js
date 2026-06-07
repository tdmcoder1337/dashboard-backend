import Product from '../models/products.js'

export const getProducts = async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const { nomi, narxi, birlik, rasm } = req.body

    if (!nomi || narxi === undefined || !birlik) {
      return res.status(400).json({ message: 'nomi, narxi and birlik are required' })
    }

    const product = await Product.create({ nomi, narxi, birlik, rasm })
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}
